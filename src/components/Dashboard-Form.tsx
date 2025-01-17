'use client'
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
import { BarChart } from "@/components/Bar-Chart"; 
import { PieChart } from "@/components/Pie-Chart"; 
import { getAllTransactions } from '@/http/get-transactions'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"; // Tabela Shadcn UI
import { getSummary } from "@/http/get-summary";
import { format } from "date-fns"; 
import { ptBR } from "date-fns/locale"; 

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  createdAt: string;
  dueDate: string;
  paymentDate: string;
  isFinalized: boolean;
}

interface Summary {
  currentBalance: number;
  futureExpenses: number;
  futureIncomes: number;
}

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [filters, setFilters] = useState({ startDate: null as Date | null, endDate: null as Date | null });
  const [filteredData, setFilteredData] = useState<Transaction[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllTransactions(1, 10);
        console.log('Transactions recebidas:', data);

        if (data && data.transactions) {
          const formatted = data.transactions.map((transaction) => ({
            ...transaction,
            category: transaction.category ? transaction.category.name : 'Sem categoria definida',
            dueDate: transaction.dueDate ? new Date(transaction.dueDate) : null,
            paymentDate: transaction.paymentDate
              ? format(new Date(transaction.paymentDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
              : "Ainda não foi realizado",
            isFinalized: !!transaction.paymentDate,
          }));

          setTransactions(formatted);
        }

        const summaryData = await getSummary();
        setSummary(summaryData);
      } catch (err) {
        console.error("Erro ao carregar dados", err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
 
    if (filters.startDate && filters.endDate) {
      const filtered = transactions.filter((transaction) => {
        if(!transaction.dueDate) return false
        return (
          transaction.dueDate >= filters.startDate &&
          transaction.dueDate <= filters.endDate
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(transactions); 
    }
  }, [filters, transactions]);

  const handleFilterChange = (key: "startDate" | "endDate", value: Date | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ startDate: null, endDate: null });
    setFilteredData(transactions); 
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          {summary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3 p-4 border rounded-lg shadow-lg bg-gray-800">
                <div className="p-2 bg-green-800 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-6 w-6 text-green-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 110-20 10 10 0 010 20z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">Saldo Atual</p>
                  <p className="text-xl text-green-400">
                    {summary.currentBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg shadow-lg bg-gray-800">
                <div className="p-2 bg-red-800 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-6 w-6 text-red-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 110-20 10 10 0 010 20z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">Despesas Futuras</p>
                  <p className="text-xl text-red-400">
                    {summary.futureExpenses.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg shadow-lg bg-gray-800">
                <div className="p-2 bg-yellow-800 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-6 w-6 text-yellow-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 110-20 10 10 0 010 20z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">Receitas Futuras</p>
                  <p className="text-xl text-yellow-400">
                    {summary.futureIncomes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gráficos de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredData.length > 0 ? (
              <>
                <div className="w-full h-64 flex justify-center items-center">
                  <BarChart data={filteredData.map((item) => ({ title: item.title, amount: item.amount }))} />
                </div>

                <div className="w-full h-64 flex justify-center items-center">
                  <PieChart data={filteredData.map((item) => ({ category: item.category, amount: item.amount }))} />
                </div>
              </>
            ) : (
              <p className="text-gray-500">Não há dados para o período selecionado.</p>
            )}

              <div className="flex justify-start space-x-4">
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date: Date | null) => handleFilterChange('startDate', date)}
                  placeholderText="Data de Início"
                  dateFormat="dd-MM-yyyy"
                  className="p-2 border border-gray-300 rounded-md text-black"
                />
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date: Date | null) => handleFilterChange('endDate', date)}
                  placeholderText="Data de Fim"
                  dateFormat="dd-MM-yyyy"
                  className="p-2 border border-gray-300 rounded-md text-black" 
                />
                <Button variant="outline" onClick={handleClearFilters} className="ml-4">
                  Limpar Filtros
                </Button>
              </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <p className="text-gray-600">Nenhuma transação encontrada.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data de Vencimento</TableHead>
                  <TableHead>Data de Pagamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.title}</TableCell>
                    <TableCell>
                      {transaction.type === "INCOME" ? (
                        <span className="text-green-600">Entrada</span>
                      ) : (
                        <span className="text-red-600">Saída</span>
                      )}
                    </TableCell>
                    <TableCell>{transaction.category === undefined ? <span>Sem categoria definida.</span> : transaction.category}</TableCell>
                    <TableCell>{transaction.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                    <TableCell>
                      {transaction.dueDate
                        ? format(transaction.dueDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                        : 'Data não definida'}
                    </TableCell>
                    <TableCell>{transaction.paymentDate}</TableCell>
                    <TableCell>
                      <span className={`p-2 text-sm ${transaction.isFinalized ? "text-green-600" : "text-yellow-600"}`}>
                        {transaction.isFinalized ? "Finalizada" : "Pendente"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
