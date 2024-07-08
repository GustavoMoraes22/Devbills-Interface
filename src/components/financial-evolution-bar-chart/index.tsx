import { ResponsiveBar } from '@nivo/bar';
import dayjs from 'dayjs';
import ptBRLocale from 'dayjs/locale/pt-br';
import { useMemo } from 'react';

import { FinancialEvolution } from '../../services/api-types';
import { theme } from '../../styles/theme';
import { formatCurrency } from '../../utils/format-currency';

dayjs.locale(ptBRLocale);

type CharData = {
  month: string;
  Saldo: number;
  Receitas: number;
  Gastos: number;
};

type FinancialEvolutionBarChartProps = {
  financialEvolution?: FinancialEvolution[];
};

export function FinancialEvolutionBarChart({
  financialEvolution,
}: FinancialEvolutionBarChartProps) {
  const data = useMemo<CharData[]>(() => {
    if (financialEvolution?.length) {
      const chartData: CharData[] = financialEvolution.map((item) => {
        const [year, month] = item._id;

        return {
          month: dayjs(`${year}- ${month}-01`).format('MMM'),
          Saldo: item.balance,
          Receitas: item.incomes,
          Gastos: item.expenses,
        };
      });

      return chartData;
    }

    return [];
  }, [financialEvolution]);

  return (
    <ResponsiveBar
      data={data}
      keys={['Saldo', 'Receitas', 'Gastos']}
      colors={[theme.colors.info, theme.colors.primary, theme.colors.error]}
      indexBy={'month'}
      groupMode="grouped"
      enableLabel={false}
      enableGridY={false}
      padding={0.2}
      axisLeft={{ tickSize: 0, format: formatCurrency }}
      margin={{ left: 80, bottom: 28 }}
      theme={{
        text: {
          fontFamily: 'Lexend',
          fontSize: 10,
        },
        axis: {
          ticks: {
            text: {
              fill: theme.colors.white,
            },
          },
        },

        tooltip: {
          container: {
            fontFamily: 'Lexend',
            fontSize: 12,
            color: theme.colors.white,
            backgroundColor: theme.colors.black,
            padding: 16,
            borderRadius: 4,
          },
        },
      }}
      valueFormat={formatCurrency}
    />
  );
}
