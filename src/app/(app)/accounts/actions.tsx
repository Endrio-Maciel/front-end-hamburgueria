'use client'
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getAllAccounts } from '@/http/list-accounts';
import { Edit, Trash2 } from 'lucide-react';
import { createAccount } from '@/http/account/create-account';
import { deleteAccount } from '@/http/account/delete-account';

interface Account {
  id: string;
  name: string;
  balance: number;
}

export function ManageAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState<string>('');

  const handleBalanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^0-9.]/g, '');
    const formattedValue = numericValue
      .replace(/(\.\d{2})\d+/g, '$1') 
      .replace(/^0+/, '') 
      .replace(/^\./, '0.'); 

    setNewAccountBalance(formattedValue);
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getAllAccounts();
        setAccounts(response);
      } catch (error) {
        console.error('Erro ao buscar contas:', error);
      }
    };
    fetchAccounts();
  }, []);

  const handleEditAccount = async ({ id, name, balance }: Account) => {
   
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      await deleteAccount(id);
      setAccounts((prevAccounts) => prevAccounts.filter((account) => account.id !== id));
      alert('Conta deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      alert('Não foi possível deletar a conta. Tente novamente mais tarde.');
    }
  };

  const handleAddAccount = async () => {
    if (newAccountName.trim() && Number(newAccountBalance) >= 0) {
      try {
        const newAccount = await createAccount(newAccountName.trim(), Number(newAccountBalance));
        setAccounts([...accounts, newAccount]);
        setNewAccountName('');
        setNewAccountBalance('');
      } catch (error) {
        console.error('Erro ao adicionar conta:', error);
        alert('Erro ao adicionar conta');
      }
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  };

  return (
    <div className="min-h-screen text-white p-4">
      <header className="p-4 mb-4">
        <h1 className="text-2xl font-bold">Gerenciar Contas</h1>
      </header>

      <main className="max-w-2xl mx-auto">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Criar Nova Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Nome da conta"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                className="flex-1"
              />
              <Input
                type="text"
                placeholder="Saldo inicial"
                value={newAccountBalance}
                onChange={handleBalanceChange}
                className="w-1/4"
              />
              <Button onClick={handleAddAccount} variant="outline">
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contas Existentes</CardTitle>
          </CardHeader>
          <CardContent>
            {accounts.length > 0 ? (
              <ul className="space-y-2">
                {accounts.map((account) => (
                  <li
                    key={account.id}
                    className="flex items-center justify-between border-b border-gray-700 py-2"
                  >
                    <span>{account.name}</span>
                    <span className="text-gray-400">
                      {typeof account.balance === 'number'
                        ? account.balance.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })
                        : 'Saldo indisponível'}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          const name = prompt('Editar nome da conta:', account.name);
                          const balance = prompt('Editar saldo da conta:', account.balance.toString());
                          if (name && balance) handleEditAccount({ id: account.id, name, balance: parseFloat(balance) });
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteAccount(account.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhuma conta encontrada.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
