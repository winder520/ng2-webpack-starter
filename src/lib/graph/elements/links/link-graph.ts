/**
 * Created by winder on 2017/3/20.
 */
var d3 = require('d3');
export class LinkGraph {
  constructor(private graph) {

  }


  private drawArrow(data, markerContainer) {
    var startArrow = data.style.startArrow;
    var endArrow = data.style.endArrow;
    if (startArrow) {
      startArrow.id = data.id + '-arrow';
      this.createPropertyMarker(markerContainer, startArrow);
    }
    if (endArrow) {
      endArrow.id = data.id + '-arrow-inverse';
      this.createInverseMarker(markerContainer, endArrow);
    }

  }

  private createPropertyMarker(markerContainer, property) {
    var marker = this.appendBasicMarker(markerContainer, property);
    marker.attr("refX", 12);
    marker.append("path")
      .attr("d", function (d) {
        return d.d;
      })
      .attr('fill', function (d) {
        return d.fill;
      })
      .attr('stroke', function (d) {
        return d.stroke;
      })
      .attr('stroke-width', function (d) {
        return d.strokeWidth;
      });

    // property.markerElement(marker);
  }

  private createInverseMarker(markerContainer, inverse) {
    var inverseMarker = this.appendBasicMarker(markerContainer, inverse);
    inverseMarker.append("path")
      .attr("d", function (d) {
        return d.d;
      })
      .attr('fill', function (d) {
        return d.fill;
      })
      .attr('stroke', function (d) {
        return d.stroke;
      })
      .attr('stroke-width', function (d) {
        return d.strokeWidth;
      });

  }

  private appendBasicMarker(markerContainer, property) {
    return markerContainer.append("marker")
      .datum(property)
      .classed('arrow', true)
      .attr("id", property.id)
      .attr("viewBox", "0 -8 14 16")
      .attr("markerWidth", 12)
      .attr("markerHeight", 12)
      .attr("markerUnits", "userSpaceOnUse")
      .attr("orient", "auto");
  }

  draw(element, markerContainer) {
    element
      .attr('fill', function (d) {
        return d.style.line.fill;
      })
      .attr('stroke', function (d) {
        return d.style.line.stroke;
      })
      .attr('stroke-width', function (d) {
        return d.style.line.strokeWidth;
      })
      .attr('marker-end', function (d) {
        if (!d.style.startArrow) return null;
        return 'url(#' + d.id + '-arrow)'
      })
      .attr('marker-start', function (d) {
        if (!d.style.endArrow) return null;
        return 'url(#' + d.id + '-arrow-inverse)'
      })
      .attr('class', function (d) {
        return d.class || 'graph-line-default';
      })
      .attr('id', function (d) {
        return d.id + '-line';
      });
    this.drawArrow(this, markerContainer)
  }

}
