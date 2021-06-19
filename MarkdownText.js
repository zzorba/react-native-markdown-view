import React from "react";
import { Text, StyleSheet } from "react-native";
import getFontFamily from "./getFontFamily";

// Returns a new version of 'obj' without properties in 'keys'.
const omit = (obj, keys) => {
  return Object.keys(obj)
    .reduce((result, key) => {
      if (!keys.includes(key)) {
        result[key] = obj[key];
      }

      return result;
    }, {});
};

// Returns a new version of 'obj' with properties in 'keys'.
const pick = (obj, keys) => {
  return Object.keys(obj)
    .reduce((result, key) => {
      if (keys.includes(key)) {
        result[key] = obj[key];
      }

      return result;
    }, {});
};

const isLeafElement = (children) => {
  // Is a component.
  if (React.isValidElement(children)) {
    return false;
  }

  // Contains at least one component.
  if (Array.isArray(children) && children.some((child) => React.isValidElement(child))) {
    return false;
  }

  return true;
};

export const FontFamilyContext = React.createContext({
  style: {},
  fonts: {
    Merriweather: {
      fontWeights: {
        300: "Light",
        400: "Regular",
        700: "Bold",
        900: "Black",
        normal: "Regular",
        bold: "Bold"
      },
      fontStyles: {
        normal: "",
        italic: "Italic"
      }
    }
  },
});

class MarkdownText extends React.Component {
  renderChildren(props, mergedStyle, fonts) {
    // Apply font styling if we're a leaf node.
    if (isLeafElement(props.children)) {
      // Determine the correct font variation given the base font ("Merriweather", "OpenSans", etc),
      // font style, and font weight,
      const fontFamily = getFontFamily(fonts, mergedStyle.fontFamily, mergedStyle);
      // Apply correct font variation and filter out font style and weight.
      const newStyle = omit({...mergedStyle, fontFamily}, ["fontStyle", "fontWeight"]);

      return (
        <Text
          {...props}
          selectable
          style={newStyle}
        />
      );
    } else {
      // Handle component and array based children.
      const newChildren = React.Children.map(props.children, (child) => {
        return isLeafElement(child)
          // Handle "string interpolation" and "Mismatch of children" cases.
          ? <MarkdownText>{child}</MarkdownText>
          // Don't alter component based children.
          : child;
      });

      // Apply converted children and filter out font related styling.
      return (
        <Text
          {...props}
          selectable
          children={newChildren}
          style={omit(mergedStyle, ["fontFamily", "fontStyle", "fontWeight"])}
        />
      );
    }
  }

  render() {
    const {style, ...props} = this.props;

    return (
      <FontFamilyContext.Consumer>
        {({ style: fontStyle, fonts }) => {
          // Retrieve the real styles if StyleSheet is used.
          const resolvedStyle = style ? StyleSheet.flatten(style) : {};
          // Filter for the styling we're interesting.
          const resolvedFontStyle = pick(resolvedStyle, ["fontFamily", "fontWeight", "fontStyle"]);
          // Merge together the contextual font style and the Text styling.
          const mergedStyle = {...fontStyle, ...resolvedStyle};

          // Only alter the contextual font style if we aren't a leaf node and we've received font related styles.
          if (Object.keys(resolvedFontStyle).length && !isLeafElement(props.children)) {
            return (
              <FontFamilyContext.Provider value={{
                fonts,
                style: {...fontStyle, ...resolvedStyle},
              }}>
                {this.renderChildren(props, mergedStyle)}
              </FontFamilyContext.Provider>
            );
          }

          return this.renderChildren(props, mergedStyle, fonts);
        }}
      </FontFamilyContext.Consumer>
    );
  }
}

export default MarkdownText;