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
    fontWeight: "normal",
    fontSize: 37,
   textAlign: "center",
  },
  descriptor1: {
    fontFamily: "OpenSans",
    fontStyle: "italic",
    fontWeight: "normal",
    fontSize: 34,
    textAlign: "center",
  },
  descriptor2: {
    fontFamily: "OpenSans",
    fontStyle: "italic",
    fontWeight: "normal",
    fontSize: 30,
    marginLeft: 3,
  },
  descriptor3: {
    fontFamily: "OpenSans",
    fontStyle: "italic",
    fontWeight: "normal",
    fontSize: 25,
    marginLeft: 15,
  },
  descriptor4: {
    fontFamily: "OpenSans",
    fontStyle: "italic",
    fontWeight: "normal",
    fontSize: 20,
    marginLeft: 30,
  },
  descriptor5: {
    fontFamily: "OpenSans",
    fontStyle: "italic",
    fontWeight: "normal",
    fontSize: 15,
    marginLeft: 45,
  },
  descriptor6: {
    fontFamily: "OpenSans",
    fontStyle: "italic",
    fontWeight: "normal",
    fontSize: 10,
    marginLeft: 75,
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
    marginLeft: 75,
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


const CrearLista = ({ lista, indice }) => {

  console.log("size of the list "+lista.length)
  console.log(typeof(lista))
  if( lista && lista.length > 0){
    console.log(lista)
    console.log(indice)
    return (
      <View>
        {lista.map((item, index) => (
          <Text key={index} style={getStyleByIndex(indice[index])}>
            {item}
          </Text>
        ))}
      </View>
    );
  }else{
    return null
  }
  
};

const MyDocument = ({ data }) => (
  <Document>
    <Page size="letter" style={styles.page}>
      <View style={styles.section}>
        {/* {data.current.map((item, index) => (
          <Text key={index} style={styles.titulo}>
            {item}
          </Text>
        ))} */}

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
