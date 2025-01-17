'use client';
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTransaction } from "@/http/create-transaction";
import { getAllCategories } from "@/http/list-categories";
import { getAllAccounts } from "@/http/list-accounts";

export function AddTransactionPage() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("INCOME");
  const [value, setValue] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [accountId, setAccountId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value)
  }

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value

    const numericValue = inputValue.replace(/[^0-9.]/g, "");
    
    const formattedValue = numericValue
      .replace(/(\.\d{2})\d+/g, "$1") 
      .replace(/^0+/, "0") 
      .replace(/^\./, "0.")

      setValue(formattedValue)
  }

  interface Category {
    id: string
    name: string
  }

  interface Account {
    id: string
    name: string
  }

  useEffect(() => {
    console.log('iniciando o useeffect')
    const fetchOptions = async () => {
     try {
      
      const categoriesRes = await getAllCategories()
      console.log("Categorias:", categoriesRes);

       const accountsRes = await getAllAccounts()
       console.log("Contas:", accountsRes);

       setCategories(categoriesRes)  
       setAccounts(accountsRes)
     } catch (err) {
       setError("Erro ao buscar opções de categorias, contas ou cartões de crédito.")
       throw new Error('erro ao buscar as opções')
     }
   }
 
   fetchOptions()
 }, [])
 

 const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  try {
    await createTransaction({
      title,
      amount: parseFloat(value),
      type,
      categoryId,
      description,
      dueDate,
      paymentDate,
      accountId,
    });
    alert("Transação adicionada com sucesso!");
    setTitle("");
    setValue("");
    setType("INCOME");
    setCategoryId("");
    setDescription("");
    setDueDate("");
    setPaymentDate("");
    setAccountId("");
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 400 && err.response.data.message === "Saldo insuficiente.") {
      setError("Saldo insuficiente na conta selecionada.");
    } else {
      setError("Erro ao adicionar a transação.");
    }
  }
};

  return (
    <div className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-white">Adicionar Transação</CardTitle>
    </CardHeader>
    <CardContent>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium text-gray-300">Título *</label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full py-2 px-3 border border-gray-600 text-white bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="amount" className="text-sm font-medium text-gray-300">Valor *</label>
          <Input
            type="text"
            id="value"
            value={value}
            onChange={handleValueChange}
            required
            className="w-full py-2 px-3 border border-gray-600 text-white bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="type" className="text-sm font-medium text-gray-300">Tipo *</label>
          <select
            id="type"
            value={type}
            onChange={handleTypeChange}
            required
            className={`w-full py-2 px-3 border rounded-md text-sm focus:outline-none focus:ring-2 ${
              type === "INCOME"
                ? "bg-green-700 text-white border-green-600 focus:ring-green-500"
                : "bg-red-700 text-white border-red-600 focus:ring-red-500"
            }`}
          >
            <option value="INCOME">Entrada</option>
            <option value="EXPENSE">Saída</option>
          </select>
        </div>

        <div>
          <label htmlFor="categoryId" className="text-sm font-medium text-gray-300">Categoria *</label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full py-2 px-3 border border-gray-600 text-white bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category: Category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium text-gray-300">Descrição</label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full py-2 px-3 border border-gray-600 text-white bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="text-sm font-medium text-gray-300">Data de Vencimento</label>
          <Input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full py-2 px-3 border border-gray-600 text-white bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="paymentDate" className="text-sm font-medium text-gray-300">Data de Pagamento</label>
          <Input
            type="date"
            id="paymentDate"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="w-full py-2 px-3 border border-gray-600 text-white bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="accountId" className="text-sm font-medium text-gray-300">Conta *</label>
          <select
            id="accountId"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
            className="w-full py-2 px-3 border border-gray-600 text-white bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma conta</option>
            {accounts.map((account: Account) => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <Button type="submit" className="mt-4 py-2 px-4 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
          Adicionar Transação
        </Button>
      </form>
    </CardContent>
  </Card>
</div>
  )
}
