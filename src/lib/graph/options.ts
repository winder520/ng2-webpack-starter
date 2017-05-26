export class Options {
  /**
   * 节点与节点之间的电荷力
   */
  charge: number = -500;
  /**
   * 连接线允许字体大小
   */
  linkTextFontSize: number = 7;
  /**
   * 连接线允许字体长度
   */
  linkTextShowLength: number = 46;
  /**
   * 节点字大小
   */
  nodeTextFontSize: number = 10;
  /**
   * 显示图的类型
   */
  showGraphType: string = 'network';
  /**
   * 是不是点连接线上面的文本
   */
  isShowLinkText: boolean = true;

  /**
   * 数据样式定义
   */
  dataDefine: any;

  /**
   * 图数据
   */
  graphData: any;

  /**
   * 是否自动布局
   */
  isAutoLayout: boolean = true;


  axiomMap: any = {};

  /**
   * 是否过滤实例
   */
  isFilterIndividual: boolean = true;

  /**
   * 是否过滤实例
   */
  isFilterClass: boolean = false;

  /**
   * 是否过滤实例
   */
  isFilterProperty: boolean = false;

  private hiddenAxiomMap: any = {};

  /**
   * 显示公理
   * @param axiomType 
   */
  showAxiom(axiomType) {
    if (this.hiddenAxiomMap[axiomType])
      this.axiomMap[axiomType] = this.hiddenAxiomMap[axiomType];
    delete this.hiddenAxiomMap[axiomType];
  }

  /**
   * 隐藏公理
   * @param axiomType 
   */
  hiddenAxiom(axiomType) {
    this.hiddenAxiomMap[axiomType] = this.axiomMap[axiomType];
    delete this.axiomMap[axiomType];
  }


  public get individualIri(): string {
    return 'http://www.w3.org/2002/07/owl#NamedIndividual';
  }

  public get classIri(): string {
    return 'http://www.w3.org/2002/07/owl#Class';
  }

  public get dataPropertyIri(): string {
    return 'http://www.w3.org/2002/07/owl#DatatypeProperty';
  }

  public get objectPropertyIri(): string {
    return 'http://www.w3.org/2002/07/owl#ObjecttypeProperty';
  }



}
