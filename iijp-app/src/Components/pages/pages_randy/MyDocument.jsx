import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import OpenSansRegular from "../../../fonts/OpenSans-Regular.ttf";
import OpenSansBold from "../../../fonts/OpenSans-Bold.ttf";

import OpenSansItalic from "../../../fonts/OpenSans-Italic.ttf";
Font.register({
  family: "OpenSans",
  fonts: [
    {
      src: OpenSansRegular,
      fontWeight: 400,
    },
    {
      src: OpenSansBold,
      fontWeight: 700,
    },
    {
      src: OpenSansItalic,
      fontStyle: "italic",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    margin: 15,
    padding: 15,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  row: {
    margin: 10,
    padding: 10,
  },
  value: {
    fontWeight: 700,
    fontSize: 20,
  },
  label: {
    fontFamily: "OpenSans",
    fontWeight: 700,
  },
  descriptor: {
    fontFamily: "OpenSans",
    fontStyle: "italic",
    fontWeight: "normal", // Puedes ajustar este valor según lo necesites
    fontSize: 15,
    padding: 4,
  },

  ratio: {
    fontWeight: "normal",
    fontSize: 12,
  },
  resolution: {
    fontWeight: "normal",
    fontSize: 15,

    padding: 4,
  },
});

const formatText = (text) => {
  return text.replace(/_x000D_/g, "\n");
};

const MyDocument = ({ data }) => (
  <Document>
    <Page size="letter" style={styles.page}>
      <View style={styles.section}>
        {data ? (
          data.map((item, index) => (
            <View key={index} style={styles.row}>
              <View>
                <Text style={styles.descriptor}>{item.descriptor}</Text>
              </View>
              <View>
                <Text style={styles.label}>{item.restrictor}</Text>
              </View>
              <View>
                <Text style={styles.resolution}>
                  Nro Resolución:
                  <Link
                    href={`http://localhost:3000/Jurisprudencia/Resolucion/${item.resolution_id}`}
                  >
                    {item.nro_resolucion}
                  </Link>
                </Text>
              </View>
              {item.ratio ? (
                <View>
                  <Text style={styles.ratio}>
                    Ratio: {formatText(item.ratio)}
                  </Text>
                </View>
              ) : (
                " "
              )}
            </View>
          ))
        ) : (
          <Text>No data available</Text>
        )}
      </View>
    </Page>
  </Document>
);

export default MyDocument;
