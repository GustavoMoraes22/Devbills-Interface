import { zodResolver } from '@hookform/resolvers/zod';
import { X } from '@phosphor-icons/react';
import { InputMask } from '@react-input/mask';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { ButtonIcon } from '../../components/button-icon';
import { Card } from '../../components/card';
import {
  CategoriesPieChart,
  CategoryProps,
} from '../../components/categories-pie-chart';
import { CreateCategoryDialog } from '../../components/create-category-dialog';
import { CreateTransactionDialog } from '../../components/create-transaction-dialog';
import { FinancialEvolutionBarChart } from '../../components/financial-evolution-bar-chart';
import { Input } from '../../components/input';
import { Logo } from '../../components/logo';
import { Title } from '../../components/title';
import { Transaction } from '../../components/transaction';
import { useFetchAPI } from '../../hooks/useFetchAPI';
import { transactionsFilterSchema } from '../../validators/schemas';
import {
  FinancialEvolutionFilterData,
  TransactionsFilterData,
} from '../../validators/types';
import {
  Header,
  Main,
  Section,
  Filters,
  InputGroup,
  Balance,
  ChartContainer,
  ChartContent,
  ChartAction,
  Aside,
  SearchTransaction,
  TransactionGroup,
  CategoryBadge,
} from './styles';

export function Home() {
  const transactionFilterForm = useForm<TransactionsFilterData>({
    defaultValues: {
      title: '',
      categoryId: '',
      beginDate: dayjs().startOf('month').format('DD/MM/YYYY'),
      endDate: dayjs().endOf('month').format('DD/MM/YYYY'),
    },
    resolver: zodResolver(transactionsFilterSchema),
  });

  const financialEvoltionFilterForm = useForm<FinancialEvolutionFilterData>({
    defaultValues: {
      year: dayjs().get('year').toString(),
    },
  });

  const {
    transactions,
    dashboard,
    fetchTransactions,
    fetchDashboard,
    fetchFinancialEvolution,
    financialEvolution,
  } = useFetchAPI();

  useEffect(() => {
    const { beginDate, endDate } = transactionFilterForm.getValues();

    fetchDashboard({ beginDate, endDate });
    fetchTransactions(transactionFilterForm.getValues());
    fetchFinancialEvolution(financialEvoltionFilterForm.getValues());
  }, [
    fetchTransactions,
    transactionFilterForm,
    fetchDashboard,
    fetchFinancialEvolution,
    financialEvoltionFilterForm,
  ]);

  const [selectedCategory, SetselectedCategory] =
    useState<CategoryProps | null>(null);

  const handleSelecteCategory = useCallback(
    async ({ id, color, title }: CategoryProps) => {
      SetselectedCategory({ id, color, title });
      transactionFilterForm.setValue('categoryId', id);

      await fetchTransactions(transactionFilterForm.getValues());
    },
    [transactionFilterForm, fetchTransactions],
  );

  const handleDeselectCategory = useCallback(async () => {
    SetselectedCategory(null);
    transactionFilterForm.setValue('categoryId', '');
    await fetchTransactions(transactionFilterForm.getValues());
  }, [transactionFilterForm, fetchTransactions]);

  const onSubmitTransactions = useCallback(
    async (data: TransactionsFilterData) => {
      await fetchTransactions(data);
    },
    [fetchTransactions],
  );

  const onSubmitDashboard = useCallback(
    async (data: TransactionsFilterData) => {
      const { beginDate, endDate } = data;

      await fetchDashboard({ beginDate, endDate });
      await fetchTransactions({ beginDate, endDate });
    },
    [fetchDashboard, fetchTransactions],
  );

  const onSubmitFinancialEvolution = useCallback(
    async (data: FinancialEvolutionFilterData) => {
      await fetchFinancialEvolution(data);
    },
    [fetchFinancialEvolution],
  );

  return (
    <>
      <Header>
        <Logo />
        <div>
          <CreateTransactionDialog />
          <CreateCategoryDialog />
        </div>
      </Header>

      <Main>
        <Section>
          <Filters>
            <Title title="Saldo" subtitle="Receitas e despesas no período" />
            <InputGroup>
              <InputMask
                component={Input}
                mask="dd/mm/aaaa"
                replacement={{ d: /\d/, m: /\d/, a: /\d/ }}
                variant="dark"
                label="Inicio"
                placeholder="dd/mm/aaaa"
                {...transactionFilterForm.register('beginDate')}
              />
              <InputMask
                component={Input}
                mask="dd/mm/aaaa"
                replacement={{ d: /\d/, m: /\d/, a: /\d/ }}
                variant="dark"
                label="Fim"
                placeholder="dd/mm/aaaa"
                {...transactionFilterForm.register('endDate')}
              />
              <ButtonIcon
                onClick={transactionFilterForm.handleSubmit(onSubmitDashboard)}
              />
            </InputGroup>
          </Filters>
          <Balance>
            <Card title="Saldo" amount={dashboard?.balance?.balance || 0} />
            <Card
              title="Receitas"
              amount={dashboard?.balance?.incomes || 0}
              variant="incomes"
            />
            <Card
              title="Gastos"
              amount={dashboard?.balance?.expenses * -1 || 0}
              variant="expenses"
            />
          </Balance>
          <ChartContainer>
            <header>
              <Title
                title="Gastos"
                subtitle="Despesas por categorias no período"
              />
              {selectedCategory && (
                <CategoryBadge
                  $color={selectedCategory.color}
                  onClick={handleDeselectCategory}
                >
                  <X />
                  {selectedCategory.title.toUpperCase()}
                </CategoryBadge>
              )}
            </header>
            <ChartContent>
              <CategoriesPieChart
                expenses={dashboard.expenses}
                onClick={handleSelecteCategory}
              />
            </ChartContent>
          </ChartContainer>
          <ChartContainer>
            <header>
              <Title
                title="Evolução Financeira"
                subtitle="Saldo,Receitas e Gastos no ano"
              />
              <ChartAction>
                <InputMask
                  component={Input}
                  mask="aaaa"
                  replacement={{ a: /\d/ }}
                  variant="black"
                  label="Ano"
                  placeholder="aaaa"
                  {...financialEvoltionFilterForm.register('year')}
                />
                <ButtonIcon
                  onClick={financialEvoltionFilterForm.handleSubmit(
                    onSubmitFinancialEvolution,
                  )}
                />
              </ChartAction>
            </header>
            <ChartContent>
              <FinancialEvolutionBarChart
                financialEvolution={financialEvolution}
              />
            </ChartContent>
          </ChartContainer>
        </Section>
        <Aside>
          <header>
            <Title title="Transações" subtitle="Receitas e Gastos no período" />
            <SearchTransaction>
              <Input
                variant="black"
                placeholder="Procurar transação..."
                {...transactionFilterForm.register('title')}
              />
              <ButtonIcon
                onClick={transactionFilterForm.handleSubmit(
                  onSubmitTransactions,
                )}
              />
            </SearchTransaction>
          </header>
          <TransactionGroup>
            {transactions?.length &&
              transactions?.map((item, index) => (
                <Transaction
                  key={item._id}
                  id={index + 1}
                  amount={
                    item.type === 'expense' ? item.amount * -1 : item.amount
                  }
                  date={dayjs(item.date).add(3, 'hours').format('DD/MM/YYYY')}
                  category={{
                    title: item.category.title,
                    color: item.category.color,
                  }}
                  title={item.title}
                  variant={item.type}
                />
              ))}
          </TransactionGroup>
        </Aside>
      </Main>
    </>
  );
}
