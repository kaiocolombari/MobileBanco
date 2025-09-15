import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Svg, Circle, Rect, Text as SvgText, G } from "react-native-svg";
import { getDashboardAnalytics, DashboardData } from "../service/dashBoardFunction";
import Rotas from "../../types/types.route";
import { useTheme } from "../context/ThemeContext";

const { width, height } = Dimensions.get("window");

export default function DashboardScreen() {
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      const data = await getDashboardAnalytics();
      setDashboardData(data);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`;
  };

  const PieChart = ({ data }: { data: { category: string; amount: number; type: 'income' | 'expense' }[] }) => {
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    const radius = 60;
    const centerX = 80;
    const centerY = 80;

    let currentAngle = 0;
    const slices = data.map((item, index) => {
      const percentage = item.amount / total;
      const angle = percentage * 360;
      const startAngle = currentAngle;
      currentAngle += angle;

      const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = centerX + radius * Math.cos(((startAngle + angle) * Math.PI) / 180);
      const y2 = centerY + radius * Math.sin(((startAngle + angle) * Math.PI) / 180);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      const colors = ['#4CAF50', '#E53935', '#FF9800'];

      return (
        <G key={index}>
          <Circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill={colors[index % colors.length]}
            stroke="#fff"
            strokeWidth="2"
          />
          <SvgText
            x={centerX}
            y={centerY}
            textAnchor="middle"
            fontSize="12"
            fill="#fff"
            fontWeight="bold"
          >
            {formatCurrency(total)}
          </SvgText>
        </G>
      );
    });

    return (
      <View style={styles.chartContainer}>
        <Svg width={160} height={160}>
          {slices}
        </Svg>
        <View style={styles.legendContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: ['#4CAF50', '#E53935', '#FF9800'][index % 3] }]} />
              <Text style={styles.legendText}>{item.category}</Text>
              <Text style={styles.legendValue}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const BarChart = ({ data }: { data: { month: string; income: number; expenses: number }[] }) => {
    const maxValue = Math.max(...data.flatMap(item => [item.income, item.expenses]));
    const chartHeight = 120;
    const chartWidth = width - 60;
    const barWidth = (chartWidth / data.length) * 0.8;

    return (
      <View style={styles.barChartContainer}>
        <Svg width={chartWidth} height={chartHeight + 40}>
          {data.map((item, index) => {
            const incomeHeight = (item.income / maxValue) * chartHeight;
            const expenseHeight = (item.expenses / maxValue) * chartHeight;
            const x = index * (chartWidth / data.length) + 10;

            return (
              <G key={index}>
                <Rect
                  x={x}
                  y={chartHeight - incomeHeight}
                  width={barWidth / 2}
                  height={incomeHeight}
                  fill="#4CAF50"
                />
                <Rect
                  x={x + barWidth / 2}
                  y={chartHeight - expenseHeight}
                  width={barWidth / 2}
                  height={expenseHeight}
                  fill="#E53935"
                />
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight + 15}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#333"
                >
                  {item.month.split('-')[1]}/{item.month.split('-')[0].slice(2)}
                </SvgText>
              </G>
            );
          })}
        </Svg>
        <View style={styles.barLegend}>
          <View style={styles.barLegendItem}>
            <View style={[styles.barLegendColor, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.barLegendText}>Receitas</Text>
          </View>
          <View style={styles.barLegendItem}>
            <View style={[styles.barLegendColor, { backgroundColor: '#E53935' }]} />
            <Text style={styles.barLegendText}>Despesas</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.header }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={25} color="grey" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Dashboard</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {dashboardData && (
          <>
            <View style={styles.summaryContainer}>
              <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Total Recebido</Text>
                <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                  {formatCurrency(dashboardData.totalIncome)}
                </Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Total Gasto</Text>
                <Text style={[styles.summaryValue, { color: '#E53935' }]}>
                  {formatCurrency(dashboardData.totalExpenses)}
                </Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Cofrinho</Text>
                <Text style={[styles.summaryValue, { color: '#FF9800' }]}>
                  {formatCurrency(dashboardData.totalPiggyBank)}
                </Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Saldo</Text>
                <Text style={[styles.summaryValue, { color: dashboardData.balance >= 0 ? '#4CAF50' : '#E53935' }]}>
                  {formatCurrency(dashboardData.balance)}
                </Text>
              </View>
            </View>

            <View style={[styles.chartSection, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Distribuição de Gastos</Text>
              <PieChart data={dashboardData.transactionCategories} />
            </View>

            <View style={[styles.chartSection, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Evolução Mensal</Text>
              <BarChart data={dashboardData.monthlyData} />
            </View>

            <View style={[styles.goalsSection, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Metas do Cofrinho</Text>
              {dashboardData.piggyBankGoals.map((goal: { name: string; current: number; target: number; progress: number }, index: number) => (
                <View key={index} style={[styles.goalCard, { backgroundColor: theme.surface }]}>
                  <View style={styles.goalHeader}>
                    <Text style={[styles.goalName, { color: theme.text }]}>{goal.name}</Text>
                    <Text style={[styles.goalProgress, { color: theme.primary }]}>{goal.progress.toFixed(1)}%</Text>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(goal.progress, 100)}%`, backgroundColor: theme.primary }
                      ]}
                    />
                  </View>
                  <Text style={[styles.goalAmount, { color: theme.textSecondary }]}>
                    {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: "row",
    paddingVertical: 18,
    paddingHorizontal: 15,
    elevation: 4,
    marginLeft: 15,
  },
  backButton: {
    paddingRight: 10,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: width * 0.06,
    fontFamily: 'Roboto_400Regular',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginTop: 10,
  },
  summaryCard: {
    padding: 15,
    borderRadius: 12,
    margin: 5,
    width: (width - 50) / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    fontFamily: 'Roboto_500Medium',
  },
  chartSection: {
    marginHorizontal: 15,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'Roboto_500Medium',
  },
  chartContainer: {
    alignItems: 'center',
  },
  legendContainer: {
    marginTop: 15,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 12,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  barChartContainer: {
    alignItems: 'center',
  },
  barLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  barLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  barLegendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 5,
  },
  barLegendText: {
    fontSize: 12,
  },
  goalsSection: {
    marginHorizontal: 15,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalCard: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalAmount: {
    fontSize: 14,
    textAlign: 'right',
  },
});
