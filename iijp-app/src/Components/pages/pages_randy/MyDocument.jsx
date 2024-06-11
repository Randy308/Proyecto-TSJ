import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import { Font } from '@react-pdf/renderer'
import OpenSansRegular from "../../../fonts/OpenSans-Regular.ttf";
import OpenSansBold from "../../../fonts/OpenSans-Bold.ttf";

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
    }
  ]
});


const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    margin: 10,
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  row: {
    margin: 20,
    padding: 20,
  },
  value: {
    fontWeight: 700,
    fontSize: 24,
  },
  label: {
    fontFamily: 'OpenSans',
    fontWeight: 700,
  },
  descriptor: {
    fontWeight: "normal", // Puedes ajustar este valor según lo necesites
  },
});

const MyDocument = ({ data }) => (
  <Document>
    <Page size="letter" style={styles.page}>
      <View style={styles.section}>
        {data ? (
          data.map((item, index) => (
            <View key={index} style={styles.row}>
              <View>
                <Text style={styles.label}>{item.restrictor}</Text>
              </View>
              <View>
                <Text>
                  Nro Resolución:
                  <Link
                    href={`http://localhost:3000/Jurisprudencia/Resolucion/${item.resolution_id}`}
                  >
                    {item.nro_resolucion}
                  </Link>
                </Text>
              </View>
              <View>
                <Text style={styles.descriptor}>
                  Descriptor: {item.descriptor}
                </Text>
              </View>
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
