'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Button } from "./ui/button"
import { AlertTriangle, Edit, Loader2, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "./ui/alert"
import { getAllTransactions } from "@/http/get-transactions"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { updateTransaction } from "@/http/change-transaction"
import { Dialog } from '@headlessui/react'
import { deleteTransaction } from "@/http/delete-transaction"

interface Transaction {
  id: string
  title: string
  amount: number
  type: "INCOME" | "EXPENSE"
  category: { name: string }
  createdAt: string
  dueDate: string
  paymentDate: string
  description?: string
  isFinalized: boolean
}

export function TransactionForm() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1) 
  const [totalTransactions, setTotalTransactions] = useState(0) 
  const [editingTransaction, setEditingTransaction ] = useState<Transaction | null>(null) 
  const [formData, setFormData] = useState<Partial<Transaction>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const perPage = 100 

  useEffect(() => {
    async function fetchTransaction() {
      try {
        setLoading(true)
        const data = await getAllTransactions(currentPage, perPage)
        console.log('Transações recebidas', data)

        if (data && data.transactions) {
          const formatted = data.transactions.map((transaction: Transaction) => ({
            ...transaction,
            dueDate: transaction.dueDate 
            ? format(new Date(transaction.dueDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) 
            : 'Data não definida',
            paymentDate: transaction.paymentDate 
            ? format(new Date(transaction.paymentDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Ainda não foi realizado",
            isFinalized: !!transaction.paymentDate,
          }))

          setTransactions(formatted)
          setTotalTransactions(data.total) 
        } 
      } catch (error) {
        setError("Erro ao carregar as transações.")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransaction()
  }, [currentPage]) 

  const totalPages = Math.ceil(totalTransactions / perPage)

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id); 
      setTransactions(transactions.filter(tx => tx.id !== id)); 
     
      setCurrentPage(currentPage)
    } catch (error) {
      setError("Erro ao deletar a transação.");
    }
  };

  const handleEdit = (transaction: Transaction) => {
    
    const dueDate = transaction.dueDate ? new Date(transaction.dueDate) : null;
    const paymentDate = transaction.paymentDate ? new Date(transaction.paymentDate) : null;

    const formattedDueDate = dueDate && !isNaN(dueDate.getTime()) ? format(dueDate, "yyyy-MM-dd") : "";
    const formattedPaymentDate = paymentDate && !isNaN(paymentDate.getTime()) ? format(paymentDate, "yyyy-MM-dd") : "";

    setEditingTransaction(transaction);
    setFormData({
    type: transaction.type,
    title: transaction.title,
    amount: transaction.amount,
    dueDate: formattedDueDate,
    paymentDate: formattedPaymentDate,
    description: transaction.description,
    category: transaction.category,
  });

  console.log('Formdata ao abrir o modal:', {
    dueDate: formattedDueDate,
    paymentDate: formattedPaymentDate,
  });

  setIsModalOpen(true);
  }

  const validateFormData = () => {

    if (formData.dueDate && formData.dueDate !== "" && isNaN(new Date(formData.dueDate).getTime())) {
      setError("Data de vencimento inválida.");
      return false;
    }
  
    if (formData.paymentDate && formData.paymentDate !== "" && isNaN(new Date(formData.paymentDate).getTime())) {
      setError("Data de pagamento inválida.");
      return false;
    }
  
    return true;
  };

  const handleSave = async () => {
    if(!validateFormData()) return

    if (editingTransaction) {
      try {
        const updatedFormData = {
          ...formData,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : undefined,
          paymentDate: formData.paymentDate ? new Date(formData.paymentDate).toISOString().split('T')[0] : undefined
        }

        const updatedTransaction = await updateTransaction(editingTransaction.id, updatedFormData);
        setTransactions((prev) => prev.map((tx) =>
          tx.id === editingTransaction.id ? updatedTransaction : tx
        ));
        setIsModalOpen(false);
        setEditingTransaction(null); 
        setFormData({});
      } catch (error) {
        setError("Erro ao atualizar a transação.");
      }
    }
  };
  
  const handleCancel = () => {
    setIsModalOpen(false)
    setFormData({})
  }

  if (loading) return <Loader2 className="flex items-center size-10 animate-spin center" />
  if (error) return(
    <Alert variant={"destructive"}>
      <AlertTriangle className="size-4" />
      <AlertDescription>
        <p>{error}</p>
      </AlertDescription>
    </Alert>
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-gray-600">Nenhuma transação encontrada.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data de Vencimento</TableHead>
                  <TableHead>Data de Pagamento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.title}</TableCell>
                    <TableCell>{transaction.category ? transaction.category.name : 'Sem categoria'}</TableCell>
                    <TableCell>
                      {transaction.type === "INCOME" ? (
                        <span className="text-green-600">Entrada</span>
                      ) : (
                        <span className="text-red-600">Saída</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {transaction.amount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </TableCell>
                    <TableCell>{transaction.dueDate}</TableCell>
                    <TableCell>{transaction.paymentDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant='ghost' onClick={() => handleEdit(transaction)}>
                          <Edit className="w-4 h-4"/>
                        </Button>
                        <Button variant='ghost' onClick={() => handleDelete(transaction.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <span className={`p-2 text-sm ${transaction.isFinalized ? "text-green-600" : "text-yellow-600"}`}>
                          {transaction.isFinalized ? "Finalizada" : "Pendente"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onClose={handleCancel}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Panel className="fixed inset-0 flex justify-center items-center">
          <div className="bg-[#27272A] p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold">Editar Transação</h3>
            <div className="mt-4">
              <label>Título</label>
              <input
                type="text"
                className="text-black w-full p-2 mt-1 border rounded"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <label>Valor</label>
              <input
                type="number"
                className="text-black w-full p-2 mt-1 border rounded"
                value={formData.amount || ""}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              />
            </div>
            <div className="mt-4">
              <label>Tipo</label>
              <select
                className="text-black w-full p-2 mt-1 border rounded"
                value={formData.type || "INCOME"}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "INCOME" | 'EXPENSE'})}
              >
                <option value="INCOME">Entrada</option>
                <option value="EXPENSE">Saída</option>
              </select>
            </div>
            <div className="mt-4">
              <label>Data de Vencimento</label>
              <input
                type="date"
                className="text-black w-full p-2 mt-1 border rounded"
                value={formData.dueDate || ""}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <label>Data de Pagamento</label>
              <input
                type="date"
                className="text-black w-full p-2 mt-1 border rounded"
                value={formData.paymentDate || ""}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <label>Descrição</label>
              <input
                type="text"
                className="text-black w-full p-2 mt-1 border rounded"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      <div className="flex justify-between items-center mt-4">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
          Página Anterior
        </Button>

        <span>Página {currentPage} de {totalPages}</span>

        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
          Próxima Página
        </Button>
      </div>
    </div>
  )
}
