import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { RateSnapshot } from '../types';
import { theme } from '../../../constants/theme';
import { Card } from '../../../components/ui/Card';

interface RatesChartProps {
  snapshots: RateSnapshot[];
}

export function RatesChart({ snapshots }: RatesChartProps) {
  // Necesitamos al menos 2 puntos para dibujar una línea
  if (!snapshots || snapshots.length < 2) {
    return null;
  }

  // 1. Tomar solo los últimos 15 registros para no saturar el gráfico
  // 2. Invertir el arreglo para que el más viejo quede a la izquierda (X) y el nuevo a la derecha
  const chartData = [...snapshots].slice(0, 15).reverse();

  // Extraer las etiquetas del eje X (Fechas cortas DD/MM)
  const labels = chartData.map(s => {
    const d = new Date(s.timestamp);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });

  // Extraer los valores del eje Y (BCV)
  const bcvData = chartData.map(s => s.bcv);

  // Obtener el ancho de la pantalla para que el gráfico sea responsivo (restamos el padding lateral)
  const screenWidth = Dimensions.get('window').width - theme.spacing.m * 2;

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Evolución del BCV</Text>
      <View style={styles.chartWrapper}>
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: bcvData,
                color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`, // theme.colors.primary naranja
                strokeWidth: 3 // Grosor de la línea
              }
            ]
          }}
          width={screenWidth - 32} // Restar padding interno del Card
          height={220}
          yAxisLabel="Bs "
          yAxisSuffix=""
          yAxisInterval={1} 
          chartConfig={{
            backgroundColor: theme.colors.surface,
            backgroundGradientFrom: theme.colors.surfaceHighlight,
            backgroundGradientTo: theme.colors.surface,
            decimalPlaces: 2, 
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`, // theme.colors.textMuted
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: theme.colors.surfaceHighlight
            }
          }}
          bezier // Línea curva suave
          style={{
            marginVertical: 8,
            borderRadius: 16,
            marginLeft: -16 // Pequeño ajuste visual para alinear el eje Y
          }}
          // Mostrar menos etiquetas en X si hay muchos puntos para no encimar texto
          hidePointsAtIndex={labels.map((_, i) => (i % 3 !== 0 && i !== labels.length - 1 ? i : -1)).filter(i => i !== -1)}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
    padding: theme.spacing.m,
    overflow: 'hidden',
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.l,
    fontWeight: theme.typography.weights.semibold,
    marginBottom: theme.spacing.s,
    textAlign: 'center',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
