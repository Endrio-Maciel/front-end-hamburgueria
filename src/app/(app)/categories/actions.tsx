'use client'
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getAllCategories } from '@/http/list-categories';
import { editCategoryInBackend } from '@/http/change-categories';
import { Edit, Trash2 } from 'lucide-react';
import { deleteCategory } from '@/http/delete-categories';
import { createCategories } from '@/http/create-category';

interface Category {
  id: string;
  name: string;
}

export function AddCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleEditCategory = async ({ id, name }: Category) => {
    try {
      const updatedCategory = await editCategoryInBackend(id, name);
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === id ? { ...category, name: updatedCategory.name } : category
        )
      );
    } catch (error) {
      console.error('Erro ao editar categoria:', error);
      alert('Erro ao editar categoria');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert('Erro ao excluir categoria');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const newCategoryData = await createCategories(newCategory.trim());
      setCategories((prevCategories) => [...prevCategories, newCategoryData]);
      setNewCategory('');
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      alert('Erro ao adicionar categoria');
    }
  };

  return (
    <div className="min-h-screen text-white p-4">
      <header className="p-4 mb-4">
        <h1 className="text-2xl font-bold">Gerenciar Categorias</h1>
      </header>

      <main className="max-w-2xl mx-auto">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Criar Nova Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Nome da categoria"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddCategory} variant="outline">
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorias Existentes</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="flex items-center justify-between border-b border-gray-700 py-2"
                  >
                    <span>{category.name}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          const name = prompt('Editar nome da categoria:', category.name);
                          if (name) handleEditCategory({ id: category.id, name });
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhuma categoria encontrada.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
