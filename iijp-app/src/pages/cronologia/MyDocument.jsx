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

import TimesNewRomanRegular from "../../fonts/times new roman.ttf";
import TimesNewRomanBold from "../../fonts/times new roman bold.ttf";
import TimesNewRomanItalic from "../../fonts/times new roman italic.ttf";

import TrebuchetMSRegular from "../../fonts/trebuc.ttf";
import TrebuchetMSBold from "../../fonts/trebucbd.ttf";
import TrebuchetMSItalic from "../../fonts/trebucit.ttf";

import CambriaRegular from "../../fonts/Cambriax.ttf";
import CambriaBold from "../../fonts/Cambria Bold.ttf";
import CambriaItalic from "../../fonts/Cambria Italic.ttf";

Font.register({
  family: "Times New Roman",
  fonts: [
    { src: TimesNewRomanRegular, fontWeight: 400 },
    { src: TimesNewRomanBold, fontWeight: 700 },
    { src: TimesNewRomanItalic, fontStyle: "italic" },
  ],
});

Font.register({
  family: "Trebuchet MS",
  fonts: [
    { src: TrebuchetMSRegular, fontWeight: 400 },
    { src: TrebuchetMSBold, fontWeight: 700 },
    { src: TrebuchetMSItalic, fontStyle: "italic" },
  ],
});

Font.register({
  family: "Cambria",
  fonts: [
    { src: CambriaRegular, fontWeight: 400 },
    { src: CambriaBold, fontWeight: 700 },
    { src: CambriaItalic, fontStyle: "italic" },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  section: {
    margin: 5,
    padding: 5,
    flexGrow: 1,
  },
  row: {
    margin: 5,
    padding: 5,
  },
  value: {
    fontWeight: 700,
    fontSize: 20,
  },
  label: {
    fontFamily: "Times New Roman",
    fontWeight: 700,
    fontSize: 13,
  },
  descriptor: {
    fontFamily: "Cambria",
    fontStyle: "italic",
    fontWeight: "normal",
    fontSize: 15,
    padding: 4,
  },
  descriptor0: {
    fontFamily: "Cambria",
    fontWeight: "normal",
    fontSize: 26,
    textAlign: "center",
  },
  descriptor1: {
    fontFamily: "Cambria",
    fontWeight: "normal",
    fontSize: 22,
    textAlign: "center",
  },
  descriptor2: {
    fontFamily: "Trebuchet MS",
    fontWeight: "normal",
    fontSize: 16,
    marginLeft: 2,
    paddingBottom: 5,
  },
  descriptor3: {
    fontFamily: "Trebuchet MS",
    fontWeight: "normal",
    fontSize: 15,
    marginLeft: 15,
    paddingBottom: 5,
  },
  descriptor4: {
    fontFamily: "Trebuchet MS",
    fontWeight: "normal",
    fontSize: 14,
    marginLeft: 30,
    paddingBottom: 5,
  },
  descriptor5: {
    fontFamily: "Trebuchet MS",
    fontWeight: "normal",
    fontSize: 13,
    marginLeft: 55,
    paddingBottom: 5,
  },
  descriptor6: {
    fontFamily: "Trebuchet MS",
    fontWeight: "normal",
    fontSize: 12,
    marginLeft: 75,
    paddingBottom: 5,
  },
  ratio: {
    fontFamily: "Times New Roman",
    fontWeight: "normal",
    fontSize: 12,
    marginTop: 10, 
    textAlign: "justify",
  },
  resolution: {
    fontFamily: "Times New Roman",
    fontWeight: "normal",
    fontSize: 12,
    paddingBottom: 15,
    marginTop: 10, 
    textAlign: "justify",
  },
  resolucion: {
    marginLeft: 75,
  },
  titulo: {
    textAlign: "center",
  },
  subtitulo: {
    textAlign: "center",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
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

const CrearLista = ({ lista, indice }) => {
  console.log("size of the list " + lista.length);
  console.log(typeof lista);
  if (lista && lista.length > 0) {
    console.log(lista);
    console.log(indice);
    return (
      <View>
        {lista.map((item, index) => (
          <Text key={index} style={getStyleByIndex(indice[index])}>
            {item}
          </Text>
        ))}
      </View>
    );
  } else {
    return null;
  }
};

const MyDocument = ({ data }) => (
  <Document>
    <Page size="letter" style={styles.page}>
      <Text style={styles.header} fixed>
        IIJP
      </Text>

      <View style={styles.section}>
        {data ? (
          data.data.map((item, index) => (
            <View key={index} style={styles.row}>
              <CrearLista lista={item.descriptor} indice={item.indices} />
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

                {item.tipo_jurisprudencia ? (
                  <View>
                    <Text style={styles.ratio}>
                      Tipo de jurisprudencia:{" "}
                      {formatText(item.tipo_jurisprudencia)}
                    </Text>
                  </View>
                ) : (
                  " "
                )}

                {item.forma_resolucion ? (
                  <View>
                    <Text style={styles.ratio}>
                      Forma de Resolucion: {formatText(item.forma_resolucion)}
                    </Text>
                  </View>
                ) : (
                  " "
                )}
                {item.proceso ? (
                  <View>
                    <Text style={styles.ratio}>
                      Proceso: {formatText(item.proceso)}
                    </Text>
                  </View>
                ) : (
                  " "
                )}

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
            </View>
          ))
        ) : (
          <Text>No existe informacion disponible</Text>
        )}
      </View>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber}`}
        fixed
      />
    </Page>
  </Document>
);

export default MyDocument;
