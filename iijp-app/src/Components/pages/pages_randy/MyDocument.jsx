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
    { src: OpenSansRegular, fontWeight: 400 },
    { src: OpenSansBold, fontWeight: 700 },
    { src: OpenSansItalic, fontStyle: "italic" },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    margin: 15,
    padding: 15,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
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
    fontSize: 13,
  },
  descriptor: {
    fontFamily: "OpenSans",
    fontStyle: "italic",
    fontWeight: "normal",
    fontSize: 15,
    padding: 4,
  },
  descriptor0: {
    fontFamily: "OpenSans",
    fontStyle: "italic",
    fontWeight: "normal",
    fontSize: 15,
    marginLeft: 10,
  },
  descriptor1: {
    fontFamily: "OpenSans",
    fontStyle: "italic",
    fontWeight: "normal",
    fontSize: 15,
    marginLeft: 20,
  },
  descriptor2: {
    fontFamily: "OpenSans",
    fontStyle: "italic",
    fontWeight: "normal",
    fontSize: 15,
    marginLeft: 30,
  },
  descriptor3: {
    fontFamily: "OpenSans",
    fontStyle: "italic",
    fontWeight: "normal",
    fontSize: 15,
    marginLeft: 40,
  },
  descriptor4: {
    fontFamily: "OpenSans",
    fontStyle: "italic",
    fontWeight: "normal",
    fontSize: 15,
    marginLeft: 50,
  },
  descriptor5: {
    fontFamily: "OpenSans",
    fontStyle: "italic",
    fontWeight: "normal",
    fontSize: 15,
    marginLeft: 60,
  },
  descriptor6: {
    fontFamily: "OpenSans",
    fontStyle: "italic",
    fontWeight: "normal",
    fontSize: 15,
    marginLeft: 70,
  },
  ratio: {
    fontWeight: "normal",
    fontSize: 12,
  },
  resolution: {
    fontWeight: "normal",
    fontSize: 11,
    paddingBottom: 10,
  },
  resolucion: {
    marginLeft: 70,
  },
  titulo: {
    textAlign: "center",
  },
  subtitulo: {
    textAlign: "center",
  },
});

const formatText = (text) => {
  return text.replace(/_x000D_/g, "\n");
};

const getStyleByIndex = (index) => {
  switch (index) {
    case 0:
      return styles.descriptor0;
    case 1:
      return styles.descriptor1;
    case 2:
      return styles.descriptor2;
    case 3:
      return styles.descriptor3;
    case 4:
      return styles.descriptor4;
    case 5:
      return styles.descriptor5;
    case 6:
      return styles.descriptor6;
    default:
      return styles.descriptor0;
  }
};

var current = [];
var titulo = "Titulo";
var subtitulo = "Subtitulo";
const CrearLista = ({ text }) => {
  var lista = text.split(" / ").map((nombre, index) => ({
    nombre,
    index,
  }));

  titulo = lista.length > 0 ? lista.shift().nombre : "";
  subtitulo = lista.length > 0 ? lista.shift().nombre : "";

  return (
    <View>
      {lista.map((item) => (
        <Text key={item.index} style={getStyleByIndex(item.index)}>
          {item.nombre}
        </Text>
      ))}
    </View>
  );
};

const MyDocument = ({ data }) => (
  <Document>
    <Page size="letter" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.subtitulo}>{subtitulo}</Text>
        {data ? (
          data.map((item, index) => (
            <View key={index} style={styles.row}>
              <CrearLista text={item.descriptor} />
              <View style={styles.resolucion}>
                <Text style={styles.label}>{item.restrictor}</Text>
                <Text style={styles.resolution}>
                  Nro Resolución:
                  <Link
                    href={`http://localhost:3000/Jurisprudencia/Resolucion/${item.resolution_id}`}
                  >
                    {item.nro_resolucion}
                  </Link>
                </Text>
                {item.ratio && (
                  <Text style={styles.ratio}>
                    Ratio: {formatText(item.ratio)}
                  </Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text>No existe informacion disponible</Text>
        )}
      </View>
    </Page>
  </Document>
);

export default MyDocument;
