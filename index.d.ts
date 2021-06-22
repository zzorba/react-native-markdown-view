declare module 'react-native-markdown-view' {
  import React from 'react';
  import { ViewStyle, ImageStyle, TextStyle, TextPropTypes } from 'react-native';

  export interface CodeBlockNode {
    lang?: string;
    content: string;
  }

  export interface EmptyNode {
  }

  export interface HeadingNode {
    level: number;
    content: InlineNode;
  }

  export interface ImageNode {
    alt: string;
    target: string;
    title: string;
    width?: number;
    height?: number;
  }

  export interface InlineContentNode {
    content: InlineNode;
  }

  export interface LinkNode {
    content: Node;
    target: string;
    title?: string;
  }

  export interface ListNode {
    ordered: boolean;
    start: number;
    items: InlineNode[];
  }

  export type TableAlign = 'right' | 'center' | 'left' | null;

  export interface TableNode {
    header: InlineNode[];
    align: TableAlign;
    cells: InlineNode[][];
  }

  export interface TextNode {
    content: string;
  }

  export type InlineNode = EmptyNode |
    ImageNode |
    InlineContentNode |
    LinkNode |
    TextNode;

  export type Node = InlineNode |
    CodeBlockNode |
    HeadingNode |
    ListNode |
    TableNode;

  export interface MarkdownStyles {
    [key: string]: TextStyle | ImageStyle | ViewStyle | undefined;
    blockQuote?: TextStyle;
    codeBlock?: TextStyle;
    del?: TextStyle;
    em?: TextStyle;
    heading?: TextStyle;
    heading1?: TextStyle;
    heading2?: TextStyle;
    heading3?: TextStyle;
    heading4?: TextStyle;
    heading5?: TextStyle;
    heading6?: TextStyle;
    hr?: TextStyle;
    imageWrapper?: ViewStyle;
    image?: ViewStyle;
    inlineCode?: TextStyle;
    link?: TextStyle;
    list?: ViewStyle;
    listItem?: ViewStyle;
    listItemNumber?: ViewStyle;
    listItemBullet?: ViewStyle;
    listItemOrderedContent?: TextStyle;
    listItemUnorderedContent?: TextStyle;
    paragraph?: TextStyle;
    strong?: TextStyle;
    table?: ViewStyle;
    tableHeaderCell?: ViewStyle;
    tableHeaderCellContent?: TextStyle;
    tableCell?: ViewStyle;
    tableCellOddRow?: ViewStyle;
    tableCellEvenRow?: ViewStyle;
    tableCellLastRow?: ViewStyle;
    tableCellOddColumn?: ViewStyle;
    tableCellEvenColumn?: ViewStyle;
    tableCellLastColumn?: ViewStyle;
    tableCellContent?: TextStyle;
    tableCellContentOddRow?: TextStyle;
    tableCellContentEvenRow?: TextStyle;
    tableCellContentLastRow?: TextStyle;
    tableCellContentOddColumn?: TextStyle;
    tableCellContentEvenColumn?: TextStyle;
    tableCellContentLastColumn?: TextStyle;
    u?: TextStyle;
  }

  export type RegexComponents = string[];
  export type NestedParseFunction = (x: string, s: any) => any;
  export type ParseState = any;

  type NodeKey = string;
  export type OutputFunction = (node: Node, s: any) => any;

  export interface RenderState {
    key: string;
    onLinkPress?: (url: string) => void;
  }

  type RenderStyle = object;

  interface RenderStyles {
    [key: string]: RenderStyle;
  }

  export interface MarkdownRule<NodeT, StateT> {
    match?: (x: string, state: RenderState, list: string[]) => RegExp | undefined | null;
    parse?: (capture: RegexComponents, parse: NestedParseFunction, state: ParseState) => NodeT;
    render: (node: Node & NodeT, output: OutputFunction, state: RenderState & StateT, style: RenderStyle) => any;
    order: number;
  }

  export interface MarkdownRules {
    [key: string]: MarkdownRule<any,any>;
  }

  export interface MarkdownFonts {
    [key: string]: {
      fontWeights: {
        [weight: string]: string;
      };
      fontStyles: {
        normal: string;
        italic: string;
      };
    };
  }

  /**
   * Set of properties applied to a MarkdownView
   *
   * @see MarkdownView
   */
  interface MarkdownViewProps {
    textStyle?: TextStyle;
    fonts?: MarkdownFonts;
    rules?: MarkdownRules;
    /**
     * An object providing styles to be passed to a corresponding rule render method. Keys are
     * rule/node names and values are React Native style objects. If a style is defined here and a
     * default style exists, they will me merged, with style properties defined here taking
     * precedence.
     */
    styles?: MarkdownStyles;
    style?: ViewStyle | TextStyle | ImageStyle;
    /**
     * Callback function for when a link is pressed. The callback receives the URL of the link as a
     * string (first and only argument).
     */
    onLinkPress?: (url: string) => void;
  }

  /**
   * View hosting markdown text.
   */
  class MarkdownView extends React.Component<MarkdownViewProps> {}

  class MarkdownText extends React.Component<TextPropTypes> {}

  export { MarkdownView, MarkdownText };
}
