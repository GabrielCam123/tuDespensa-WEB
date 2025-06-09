import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Opcional: Registrar fuente si quieres un estilo diferente
// Font.register({
//   family: "Open Sans",
//   src: "https://fonts.googleapis.com/css2?family=Open+Sans&display=swap",
// });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#e0e0e0",
    padding: 4,
    fontWeight: "bold",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
  },
  textCenter: {
    textAlign: "center",
  },
});

const ReportePDF = ({
  reporte,
  fechaInicio,
  fechaFin,
  tipoUsuario,
  usuariosFiltrados,
}) => {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Reporte Ejecutivo</Text>

        <View style={styles.section}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Fecha Desde: </Text>
            {fechaInicio || "No especificada"}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Fecha Hasta: </Text>
            {fechaFin || "No especificada"}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Tipo de Usuario: </Text>
            {tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)}
          </Text>
        </View>

        <View style={styles.section}>
          {(tipoUsuario === "todos" || tipoUsuario === "gratuito") && (
            <Text>Usuarios Gratuitos: {reporte.usuariosGratuitos ?? "-"}</Text>
          )}
          {(tipoUsuario === "todos" || tipoUsuario === "premium") && (
            <Text>Usuarios Premium: {reporte.usuariosPremium ?? "-"}</Text>
          )}
          {tipoUsuario === "todos" && (
            <Text>Total de Usuarios: {reporte.totalUsuarios ?? "-"}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeader}>Registros Mensuales</Text>
          {reporte.registrosMensuales &&
          reporte.registrosMensuales.length > 0 ? (
            reporte.registrosMensuales.map((item, index) => (
              <Text key={index}>
                {item.mes}: {item.cantidad}
              </Text>
            ))
          ) : (
            <Text>No hay registros mensuales disponibles.</Text>
          )}
        </View>

        {usuariosFiltrados && usuariosFiltrados.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Usuarios Registrados</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeader}>#</Text>
                <Text style={styles.tableColHeader}>Nombre de Usuario</Text>
                <Text style={styles.tableColHeader}>Correo</Text>
                <Text style={styles.tableColHeader}>Fecha de Registro</Text>
              </View>
              {usuariosFiltrados.map((user, index) => (
                <View
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? { backgroundColor: "#f9f9f9" } : {},
                  ]}
                  key={index}
                >
                  <Text style={styles.tableCol}>{index + 1}</Text>
                  <Text style={styles.tableCol}>
                    {user.username ?? "Sin nombre"}
                  </Text>
                  <Text style={styles.tableCol}>{user.email ?? "-"}</Text>
                  <Text style={styles.tableCol}>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ReportePDF;
