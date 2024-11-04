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

import { headingItems } from "../../data/HeadingItems.js";
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

const defaultStyles = {
  descriptor0: headingItems[0].estiloDefault,
  descriptor1: headingItems[1].estiloDefault,
  descriptor2: headingItems[2].estiloDefault,
  descriptor3: headingItems[3].estiloDefault,
  descriptor4: headingItems[4].estiloDefault,
  descriptor5: headingItems[5].estiloDefault,
  descriptor6: headingItems[6].estiloDefault,
  ratio: headingItems[7].estiloDefault,
  resolution: headingItems[8].estiloDefault,
};

// Función para cargar un estilo específico desde localStorage con manejo de errores
const loadStyle = async(key, defaultValue) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error al cargar ${key} desde localStorage:`, error);
    return defaultValue;
  }
};

// Carga de estilos con manejo de errores
const loadedStyles = {
  descriptor0: loadStyle("descriptor0", defaultStyles.descriptor0),
  descriptor1: loadStyle("descriptor1", defaultStyles.descriptor1),
  descriptor2: loadStyle("descriptor2", defaultStyles.descriptor2),
  descriptor3: loadStyle("descriptor3", defaultStyles.descriptor3),
  descriptor4: loadStyle("descriptor4", defaultStyles.descriptor4),
  descriptor5: loadStyle("descriptor5", defaultStyles.descriptor5),
  descriptor6: loadStyle("descriptor6", defaultStyles.descriptor6),
  ratio: loadStyle("ratio", defaultStyles.ratio),
  resolution: loadStyle("resolution", defaultStyles.resolution),
};

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
  descriptor0: loadedStyles.descriptor0,
  descriptor1: loadedStyles.descriptor1,
  descriptor2: loadedStyles.descriptor2,
  descriptor3: loadedStyles.descriptor3,
  descriptor4: loadedStyles.descriptor4,
  descriptor5: loadedStyles.descriptor5,
  descriptor6: loadedStyles.descriptor6,
  ratio: loadedStyles.ratio,
  resolution: loadedStyles.resolution,
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
  //console.log("size of the list " + lista.length);
  //console.log(typeof lista);
  if (lista && lista.length > 0) {
    //console.log(lista);
    //console.log(indice);
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
