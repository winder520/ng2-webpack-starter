let _ = require('lodash');
import { Options } from '../options';
export class Filter {
  private filter = {}
  private nodeIdMap
  private axiomMap;

  constructor(private options: Options) { }

  init(axiom) {
    this.axiomMap = _.clone(axiom)
    this.nodeIdMap = {};
    for (var key in this.axiomMap) {
      var nodes = this.axiomMap[key];
      nodes.forEach((item) => {
        this.nodeIdMap[item] = true;
      })
    }
  }

  filterNodes(nodes) {
    return nodes.filter((node) => {

      return node.type ? !!this.nodeIdMap[node.id] : true;
    })
  }

  filterLinks(links) {
    return links.filter((link) => {
      if ((link.type ? !!this.axiomMap[link.type] : true)) {
        return this.nodeIdMap[link.source] && this.nodeIdMap[link.target];
      }
      return false;
    })
  }

  /**
   * 过滤实例节点 并且
   * @param nodes 节点列表
   * @param links 连接线（边）列表
   */
  filterIndividualNodes(nodes: any[], links: any[]) {
    if (!this.options.isFilterIndividual) return nodes;
    var individualNodes: any[] = links.filter(item => {
      return item.target === this.options.individualIri;
    }).map(item => {
      return item.source;
    });
    var individualChildrenNodes: any[] = links.filter(item => {
      return individualNodes.indexOf(item.source) > -1;
    }).map(item => {
      return item.target;
    });

    individualNodes = individualNodes.concat(individualChildrenNodes);

    return nodes.filter(item => {
      //过滤实例的时候保留类
      return item.type === this.options.classIri || individualNodes.indexOf(item.id) === -1;
    })

  }

  filterClassNodes(nodes) {

  }
}
