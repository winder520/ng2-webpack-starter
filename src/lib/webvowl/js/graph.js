var _ = require("lodash/core");
var math = require("./util/math")();
var linkCreator = require("./parsing/linkCreator")();
var elementTools = require("./util/elementTools")();
var d3 = require('d3');


module.exports = function (graphContainerSelector) {



  var graph = {},
    CARDINALITY_HDISTANCE = 20,
    CARDINALITY_VDISTANCE = 10,
    curveFunction = d3.line()
      .x(function (d) { return d.x })
      .y(function (d) { return d.y })
      .curve(d3.curveCardinal),
    options = require("./options")(),
    parser = require("./parser")(graph),
    language = "default",
    paused = false,
    // Container for visual elements
    graphContainer,
    nodeContainer,
    labelContainer,
    cardinalityContainer,
    linkContainer,
    // Visual elements
    nodeElements,
    labelGroupElements,
    linkGroups,
    linkPathElements,
    cardinalityElements,
    // Internal data
    classNodes,
    labelNodes,
    links,
    properties,
    unfilteredData,
    // Graph behaviour
    force,
    dragBehaviour,
    zoomFactor,
    graphTranslation,
    graphUpdateRequired = false,
    pulseNodeIds,
    nodeArrayForPulse = [],
    nodeMap = [],
    zoom,
    //store event
    hashEvent = {}
    ;


	/**
	 * Recalculates the positions of nodes, links, ... and updates them.
	 */
  function recalculatePositions() {
    // Set node positions
    nodeElements.attr("transform", function (node) {
      return "translate(" + node.x + "," + node.y + ")";
    });

    // Set label group positions
    labelGroupElements.attr("transform", function (label) {
      var position;

      // force centered positions on single-layered links
      var link = label.link();
      if (link.layers().length === 1 && !link.loops()) {
        var linkDomainIntersection = math.calculateIntersection(link.range(), link.domain(), 0);
        var linkRangeIntersection = math.calculateIntersection(link.domain(), link.range(), 0);
        position = math.calculateCenter(linkDomainIntersection, linkRangeIntersection);
        label.x = position.x;
        label.y = position.y;
      }
      return "translate(" + label.x + "," + label.y + ")";
    });
    // Set link paths and calculate additional information
    linkPathElements.attr("d", function (l) {
      if (l.isLoop()) {
        return math.calculateLoopPath(l);
      }
      var curvePoint = l.label();
      var pathStart = math.calculateIntersection(curvePoint, l.domain(), 1);
      var pathEnd = math.calculateIntersection(curvePoint, l.range(), 1);
      return math.curveFunction([pathStart, curvePoint, pathEnd]);
    });

    // Set cardinality positions
    cardinalityElements.attr("transform", function (property) {
      if (!property.link()) return "translate(" + 0 + "," + 0 + ")";
      var label = property.link().label(),
        pos = math.calculateIntersection(label, property.range(), CARDINALITY_HDISTANCE),
        normalV = math.calculateNormalVector(label, property.domain(), CARDINALITY_VDISTANCE);

      return "translate(" + (pos.x + normalV.x) + "," + (pos.y + normalV.y) + ")";
    });

  }

	/**
	 * Adjusts the containers current scale and position.
	 */
  function zoomed() {
    graphContainer.attr("transform", "translate(" + [d3.event.transform.x, d3.event.transform.y] + ")scale(" + d3.event.transform.k + ")");
    // store zoom factor for export
    zoomFactor = d3.event.transform.k;
    graphTranslation = [d3.event.transform.x, d3.event.transform.y];
  }

	/**
	 * Initializes the graph.
	 */
  function initializeGraph() {
    options.graphContainerSelector(graphContainerSelector);

    // force = d3.forceSimulation()
    //    .force("charge", d3.forceManyBody())
    //   .force("link", d3.forceLink().distance(calculateLinkPartDistance).strength(options.linkStrength()))
    //   .force("center", d3.forceCenter().x(options.width()).y(options.height()))
    // .force("x", d3.forceX())
    // .force("y", d3.forceY())
    // .on("tick", recalculatePositions);

    dragBehaviour = d3.drag()
      .subject(function (d) {
        return d === null ? { x: d3.event.x, y: d3.event.y } : d;
      })
      .on("start", function (d) {
        // d3.event.sourceEvent.stopPropagation();
        if (!d3.event.active) force.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        // d3.event.sourceEvent.stopPropagation(); // Prevent panning
        // d.locked(true);
      })
      .on("drag", function (d) {
        // d.px = d3.event.x;
        // d.py = d3.event.y;
        //force.resume();
        d.fx = d3.event.x;
        d.fy = d3.event.y;
        // force.restart();
      })
      .on("end", function (d) {
        // d.locked(false);
        if (!d3.event.active) force.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    // Apply the zooming factor.
    zoom = d3.zoom()
      .duration(150)
      .scaleExtent([options.minMagnification(), options.maxMagnification()])
      .on("zoom", zoomed);
  }

  initializeGraph();

	/**
	 * Returns the graph options of this graph (readonly).
	 * @returns {webvowl.options} a graph options object
	 */
  graph.graphOptions = function () {
    return options;
  };

  graph.scaleFactor = function () {
    return zoomFactor;
  };
  graph.translation = function () {
    return graphTranslation;
  };

  /** Returns the visible nodes */
  graph.graphNodeElements = function () {
    return nodeElements;
  };
  /** Returns the visible Label Nodes */
  graph.graphLabelElements = function () {
    return labelNodes;
  };


  /** Loads all settings, removes the old graph (if it exists) and draws a new one. */
  graph.start = function () {
    // force.stop();
    loadGraphData();
    redrawGraph();
    graph.update();
  };

  /**    Updates only the style of the graph. */
  graph.updateStyle = function () {
    refreshGraphStyle();
    force.restart();
  };

  graph.reload = function () {
    loadGraphData();
    this.update();
  };

  graph.load = function () {
    force.stop();
    loadGraphData();
    refreshGraphData();
    for (var i = 0; i < labelNodes.length; i++) {
      var label = labelNodes[i];
      if (label.property().x && label.property().y) {
        label.x = label.property().x;
        label.y = label.property().y;
        // also set the prev position of the label
        label.px = label.x;
        label.py = label.y;
      }
    }
    graph.update();
  };


	/**
	 * Updates the graphs displayed data and style.
	 */
  graph.update = function () {
    refreshGraphData();

    // update node map
    nodeMap = [];
    var node;
    force.nodes().forEach(function (node) {
      if (node.id) {
        nodeMap[node.id()] = j;
        // check for equivalents
        var eqs = node.equivalents();
        if (eqs.length > 0) {
          eqs.forEach(function (eqObject) {
            nodeMap[eqObject.id()] = j
          });
        }
      }
      if (node.property) {
        nodeMap[node.property().id()] = j;
        var inverse = node.inverse();
        if (inverse) {
          nodeMap[inverse.id()] = j;
        }
      }
    })
    force.restart();
    redrawContent();
    graph.updatePulseIds(nodeArrayForPulse);
    refreshGraphStyle();
    var haloElement;
    var halo;
    for (var j = 0; j < force.nodes().length; j++) {
      node = force.nodes()[j];
      if (node.id) {
        haloElement = node.getHalos();
        if (haloElement) {
          halo = haloElement.selectAll(".searchResultA");
          halo.classed("searchResultA", false);
          halo.classed("searchResultB", true);
        }
      }

      if (node.property) {
        haloElement = node.property().getHalos();
        if (haloElement) {
          halo = haloElement.selectAll(".searchResultA");
          halo.classed("searchResultA", false);
          halo.classed("searchResultB", true);
        }
      }
    }
  };

  graph.paused = function (p) {
    if (!arguments.length) return paused;
    paused = p;
    graph.updateStyle();
    return graph;
  };

	/**
	 * Resets visual settings like zoom or panning.
	 */

  /** setting the zoom factor **/
  graph.setZoom = function (value) {
    zoom.scale(value);
  };

  /** setting the translation factor **/
  graph.setTranslation = function (translation) {
    zoom.translate([translation[0], translation[1]]);
  };

  /** resetting the graph **/
  graph.reset = function () {
    zoom.translate([0, 0])
      .scale(1);
  };

	/**
	 * Calculate the link distance of a single link part.
	 * The visible link distance does not contain e.g. radii of round nodes.
	 * @param linkPart the link
	 * @returns {*}
	 */
  function calculateLinkPartDistance(linkPart) {
    var link = linkPart.link();

    if (link.isLoop()) {
      return options.loopDistance();
    }

    // divide by 2 to receive the length for a single link part
    var linkPartDistance = getVisibleLinkDistance(link) / 2;
    linkPartDistance += linkPart.domain().actualRadius();
    linkPartDistance += linkPart.range().actualRadius();
    return linkPartDistance;
  }

  function getVisibleLinkDistance(link) {
    if (elementTools.isDatatype(link.domain()) || elementTools.isDatatype(link.range())) {
      return options.datatypeDistance();
    } else {
      return options.classDistance();
    }
  }

	/**
	 * Empties the last graph container and draws a new one with respect to the
	 * value the graph container selector has.
	 */
  function redrawGraph() {
    remove();

    graphContainer = d3.select(options.graphContainerSelector())
      .append("svg")
      .classed("vowlGraph", true)
      .attr("width", '100%')
      .attr("height", '100%')
      .call(zoom)
      .append("g");
  }

  /** search functionality **/
  graph.getUpdateDictionary = function () {
    return parser.getDictionary();
  };

  graph.resetSearchHighlight = function () {
    // get all nodes (handle also already filtered nodes )
    pulseNodeIds = [];
    nodeArrayForPulse = [];


    // clear from stored nodes
    var nodes = unfilteredData.nodes;
    var props = unfilteredData.properties;
    var j;

    nodes.forEach(function (node) {
      if (node.removeHalo)
        node.removeHalo();
    })

    props.forEach(function (prop) {
      if (prop.removeHalo)
        prop.removeHalo();
    })
  };

  graph.updatePulseIds = function (nodeIdArray) {

    pulseNodeIds = [];
    if (nodeIdArray.length === 0) {
      return;
    }

    for (var i = 0; i < nodeIdArray.length; i++) {
      var selectedId = nodeIdArray[i];
      var forceId = nodeMap[selectedId];
      if (forceId !== undefined) {
        var le_node = force.nodes()[forceId];
        if (le_node.id && pulseNodeIds.indexOf(forceId) === -1) {
          pulseNodeIds.push(forceId);
        }
        if (le_node.property && pulseNodeIds.indexOf(forceId) === -1) {
          pulseNodeIds.push(forceId);
        }
      }
    }
  };

  graph.highLightNodes = function (nodeIdArray) {
    if (nodeIdArray.length === 0) {
      return;
      // nothing to highlight
    }
    pulseNodeIds = [];
    nodeArrayForPulse = nodeIdArray;
    var missedIds = [];
    // identify the force id to highlight
    for (var i = 0; i < nodeIdArray.length; i++) {
      var selectedId = nodeIdArray[i];
      var forceId = nodeMap[selectedId];

      if (forceId !== undefined) {
        var le_node = force.nodes()[forceId];
        if (le_node.id && pulseNodeIds.indexOf(forceId) === -1) {
          pulseNodeIds.push(forceId);
          le_node.foreground();
          le_node.drawHalo();
        }
        if (le_node.property && pulseNodeIds.indexOf(forceId) === -1) {
          pulseNodeIds.push(forceId);
          le_node.property().foreground();
          le_node.property().drawHalo();
        }
      }
      else {
        // check if they have an equivalent or an inverse!
        console.log("Could not Find Id in Graph (maybe filtered out) id = " + selectedId);
        missedIds.push(selectedId);
      }
    }

    // store the highlight on the missed nodes;
    var s_nodes = unfilteredData.nodes;
    var s_props = unfilteredData.properties;

    missedIds.forEach(function (missedId) {
      s_nodes.forEach(function (node) {
        var nodeId = node.id();
        if (nodeId === missedId) {
          node.drawHalo();
        }
      })
      s_props.forEach(function (node) {
        var propId = node.id();
        if (propId === missedId) {
          node.drawHalo();
        }
      })
    });
  };

	/**
	 * removes data when data could not be loaded
	 */
  graph.clearGraphData = function () {
    var sidebar = graph.options().sidebar();
    if (sidebar)
      sidebar.clearOntologyInformation();
    if (graphContainer)
      redrawGraph();
  };

	/**
	 * Redraws all elements like nodes, links, ...
	 */
  function redrawContent() {
    var markerContainer;

    if (!graphContainer) {
      return;
    }

    // Empty the graph container
    graphContainer.selectAll("*").remove();

    // Last container -> elements of this container overlap others
    linkContainer = graphContainer.append("g").classed("linkContainer", true);
    cardinalityContainer = graphContainer.append("g").classed("cardinalityContainer", true);
    labelContainer = graphContainer.append("g").classed("labelContainer", true);
    nodeContainer = graphContainer.append("g").classed("nodeContainer", true);

    // Add an extra container for all markers
    markerContainer = linkContainer.append("defs");

    // Draw nodes
    nodeElements = nodeContainer.selectAll(".node")
      .data(classNodes).enter()
      .append("g")
      .classed("node", true)
      .attr("id", function (d) {
        return d.id();
      })
      .call(dragBehaviour)
      .on("contextmenu", function (e) {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        var eventList = hashEvent['contextmenu'];
        if (!eventList) return;
        eventList.forEach(function (fn) {
          fn(d3.event, e);
        });

      });

    nodeElements.each(function (node) {
      console.log(node);
      node.draw(d3.select(this));
    });

    // Draw label groups (property + inverse)
    labelGroupElements = labelContainer.selectAll(".labelGroup")
      .data(labelNodes).enter()
      .append("g")
      .classed("labelGroup", true)
      .call(dragBehaviour);

    labelGroupElements.each(function (label) {
      var success = label.draw(d3.select(this));
      // Remove empty groups without a label.
      if (!success) {
        d3.select(this).remove();
      }
    });

    // Place subclass label groups on the bottom of all labels
    labelGroupElements.each(function (label) {
      // the label might be hidden e.g. in compact notation
      if (!this.parentNode) {
        return;
      }

      if (elementTools.isRdfsSubClassOf(label.property())) {
        var parentNode = this.parentNode;
        parentNode.insertBefore(this, parentNode.firstChild);
      }
    });

    // Draw cardinalities
    cardinalityElements = cardinalityContainer.selectAll(".cardinality")
      .data(properties).enter()
      .append("g")
      .classed("cardinality", true);

    cardinalityElements.each(function (property) {
      var success = property.drawCardinality(d3.select(this));

      // Remove empty groups without a label.
      if (!success) {
        d3.select(this).remove();
      }
    });

    // Draw links
    linkGroups = linkContainer.selectAll(".link")
      .data(links).enter()
      .append("g")
      .classed("link", true);

    linkGroups.each(function (link) {
      link.draw(d3.select(this), markerContainer);
    });

    // Select the path for direct access to receive a better performance
    linkPathElements = linkGroups.selectAll("path");

    var matcher = graphContainerSelector.outerHTML.match(/_ngcontent-[0-9a-z]+/i);
    if (matcher) {
        matcher = matcher[0];
      }
    graphContainer.selectAll('*').attr(matcher, '');

    addClickEvents();
  }

	/**
	 * Applies click listeners to nodes and properties.
	 */
  function addClickEvents() {
    function executeModules(selectedElement) {
      options.selectionModules().forEach(function (module) {
        module.handle(selectedElement);
      });
    }

    nodeElements.on("click", function (clickedNode) {
      executeModules(clickedNode);
    });

    labelGroupElements.selectAll(".label").on("click", function (clickedProperty) {
      executeModules(clickedProperty);
    });
  }

  function generateDictionary(data) {
    var i;
    var originalDictionary = [];
    var nodes = data.nodes;
    for (i = 0; i < nodes.length; i++) {
      // check if node has a label
      if (nodes[i].labelForCurrentLanguage() !== undefined)
        originalDictionary.push(nodes[i]);
    }
    var props = data.properties;
    for (i = 0; i < props.length; i++) {
      if (props[i].labelForCurrentLanguage() !== undefined)
        originalDictionary.push(props[i]);
    }
    parser.setDictionary(originalDictionary);

    var literFilter = graph.options().literalFilter();
    var idsToRemove;

    if (literFilter)
      idsToRemove = literFilter.removedNodes()
    var originalDict = parser.getDictionary();
    var newDict = [];

    // go through the dictionary and remove the ids;
    for (i = 0; i < originalDict.length; i++) {
      var dictElement = originalDict[i];
      var dictElementId;
      if (dictElement.property)
        dictElementId = dictElement.property().id();
      else
        dictElementId = dictElement.id();
      // compare against the removed ids;
      var addToDictionary = true;
      if (idsToRemove) {
        for (var j = 0; j < idsToRemove.length; j++) {
          var currentId = idsToRemove[j];
          if (currentId === dictElementId) {
            addToDictionary = false;
          }
        }

      }
      if (addToDictionary === true) {
        newDict.push(dictElement);
      }
    }
    // tell the parser that the dictionary is updated
    parser.setDictionary(newDict);

  }

  function loadGraphData() {
    parser.parse(options.data());
    unfilteredData = {
      nodes: parser.nodes(),
      properties: parser.properties()
    };

    // Initialize filters with data to replicate consecutive filtering
    var initializationData = _.clone(unfilteredData);
    options.filterModules().forEach(function (module) {
      initializationData = filterFunction(module, initializationData, true);
    });

    // generate dictionary here ;
    generateDictionary(unfilteredData);

    parser.parseSettings();
    graphUpdateRequired = parser.settingsImported();
    // graph.options().searchMenu().requestDictionaryUpdate();
  }

	/**
	 * Applies the data of the graph options object and parses it. The graph is not redrawn.
	 */
  function refreshGraphData() {
    var preprocessedData = _.clone(unfilteredData);

    // Filter the data
    options.filterModules().forEach(function (module) {
      preprocessedData = filterFunction(module, preprocessedData);
    });

    classNodes = preprocessedData.nodes;
    properties = preprocessedData.properties;
    links = linkCreator.createLinks(properties);
    labelNodes = links.map(function (link) {
      return link.label();
    });
    storeLinksOnNodes(classNodes, links);
    setForceLayoutData(classNodes, labelNodes, links);
  }

  function filterFunction(module, data, initializing) {
    links = linkCreator.createLinks(data.properties);
    storeLinksOnNodes(data.nodes, links);

    if (initializing && module.initialize) {
      module.initialize(data.nodes, data.properties);
    }

    module.filter(data.nodes, data.properties);
    return {
      nodes: module.filteredNodes(),
      properties: module.filteredProperties()
    };
  }

  function storeLinksOnNodes(nodes, links) {
    for (var i = 0, nodesLength = nodes.length; i < nodesLength; i++) {
      var node = nodes[i],
        connectedLinks = [];

      // look for properties where this node is the domain or range
      for (var j = 0, linksLength = links.length; j < linksLength; j++) {
        var link = links[j];

        if (link.domain() === node || link.range() === node) {
          connectedLinks.push(link);
        }
      }
      node.links(connectedLinks);
    }
  }

  function setForceLayoutData(classNodes, labelNodes, links) {
    var d3Links = [];
    links.forEach(function (link) {
      d3Links = d3Links.concat(link.linkParts());
    });

    var d3Nodes = [].concat(classNodes).concat(labelNodes);
    force = d3.forceSimulation(d3Nodes)
      .force("charge", d3.forceManyBody())
      .force("link", d3.forceLink(d3Links).id(function (d) { return d.id }))
      .on("tick", recalculatePositions)
    //   .force("center", d3.forceCenter(options.width() / 2, options.height() / 2))
    // .force("x", d3.forceX())
    // .force("y", d3.forceY())
    // force
    //   .force("link", d3.forceLink()
    //     .id(d => d.id)
    //     .distance(calculateLinkPartDistance));
    setPositionOfOldLabelsOnNewLabels(force.nodes(), labelNodes);


    // force.nodes(d3Nodes).on("tick", recalculatePositions);
    // force.force("link").links(d3Links);
    //force.nodes(d3Nodes);
    //force.force("link").links(d3Links);
  }

	/**
	 * The label nodes are positioned randomly, because they are created from scratch if the data changes and lose
	 * their position information. With this hack the position of old labels is copied to the new labels.
	 */
  function setPositionOfOldLabelsOnNewLabels(oldLabelNodes, labelNodes) {
    labelNodes.forEach(function (labelNode) {
      for (var i = 0; i < oldLabelNodes.length; i++) {
        var oldNode = oldLabelNodes[i];
        if (oldNode.equals(labelNode)) {
          labelNode.x = oldNode.x;
          labelNode.y = oldNode.y;
          labelNode.fx = oldNode.fx;
          labelNode.fy = oldNode.fy;
          break;
        }
      }
    });
  }


	/**
	 * Applies all options that don't change the graph data.
	 */
  function refreshGraphStyle() {
    // zoom = zoom.scaleExtent([options.minMagnification(), options.maxMagnification()]);
    // if (graphContainer) {
    //   //zoom.event(graphContainer);
    // }


    // force.charge(function (element) {
    // 	var charge = options.charge();
    // 	if (elementTools.isLabel(element)) {
    // 		charge *= 0.8;
    // 	}
    // 	return charge;
    // })
    // 	.size([options.width(), options.height()])
    // 	.linkDistance(calculateLinkPartDistance)
    // 	.gravity(options.gravity())
    // 	.linkStrength(options.linkStrength()); // Flexibility of links


    force.force("charge").strength(function (element) {
      var charge = options.charge();
      if (elementTools.isLabel(element)) {
        charge *= 0.8;
      }
      return charge;
    });
    force.force("link").distance(calculateLinkPartDistance).strength(options.linkStrength());
    force.force('x', d3.forceX(options.gravity()).x(function () { return options.width() }))
      .force('y', d3.forceY(options.gravity()).y(function () { return options.height() }))

    //force.force("charge", d3.forceManyBody())
    //.force('gravity', options.gravity)
    //.force('strength', options.linkStrength)
    //;

    force.nodes().forEach(function (n) {
      n.frozen(paused);
    });
  }

	/**
	 * Removes all elements from the graph container.
	 */
  function remove() {
    if (graphContainer) {
      // Select the parent element because the graph container is a group (e.g. for zooming)
      d3.select(graphContainer.node().parentNode).remove();
    }
  }

  graph.options = function () {
    return options;
  };

  graph.language = function (newLanguage) {
    if (!arguments.length) return language;

    // Just update if the language changes
    if (language !== newLanguage) {
      language = newLanguage || "default";
      redrawContent();
      recalculatePositions();
      graph.options().searchMenu().requestDictionaryUpdate();
      graph.resetSearchHighlight();
    }
    return graph;
  };

  /**
   * 获取节点 根据ID
   */
  function findNodeById(id) {
    var resultSet = [],
      optionData = options.data(),
      dataList,
      len;
    for (var key in optionData) {
      dataList = optionData[key];
      if (dataList && Array.isArray(dataList)) {
        dataList.forEach(function (item, index) {
          if (item.id === id || item.domain === id || item.range === id) {
            resultSet.push({
              key: key,
              index: index,
              value: item
            })
          }
        })
      }
    }
    return resultSet;
  }

  graph.removedNode = function (id) {
    var dataNodeList = findNodeById(id);
    var dataObj = options.data();
    dataNodeList.forEach(function (node) {
      dataObj[node.key].remove(node.value);
    })
    //dataObj[dataNode.key].splice(dataNode.index, 1);
    if (graphContainer)
      graph.load();

  }

  graph.addEventListener = function (key, fn) {
    var eventList = hashEvent[key];
    if (!eventList) {
      eventList = [];
      hashEvent[key] = eventList;
    }
    eventList.push(fn);
  }

  graph.removeEventListener = function (key, fn) {
    var eventList = hashEvent[key];
    if (!eventList) {
      return;
    }
    var len = eventList.length;
    for (var i = 0; i < len; i++) {
      if (eventList[i] === fn) {
        eventList.splice(i, 1);
        return;
      }
    }

  }


  return graph;
};
