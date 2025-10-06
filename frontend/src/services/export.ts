import { GrupoDuplicados } from '@/types';
import * as XLSX from 'xlsx';

export function exportToExcel(grupos: GrupoDuplicados[]) {
  const data: any[] = [];

  grupos.forEach((grupo) => {
    grupo.productos.forEach((producto) => {
      data.push({
        'Grupo ID': grupo.id,
        'Estado': grupo.estado.replace('_', ' '),
        'Confianza (%)': grupo.confianza || 'N/A',
        'Análisis OpenAI': grupo.analisisOpenAI || 'N/A',
        'Producto ID': producto.id,
        'Código': producto.codigo,
        'Descripción': producto.descripcion,
        'Marca': producto.marca,
        'Categoría': producto.categoria,
        'Similitud (%)': (producto.similitudConPrincipal * 100).toFixed(2),
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Duplicados');

  // Ajustar anchos de columna
  const maxWidth = 50;
  const wscols = [
    { wch: 10 }, // Grupo ID
    { wch: 20 }, // Estado
    { wch: 15 }, // Confianza
    { wch: maxWidth }, // Análisis OpenAI
    { wch: 12 }, // Producto ID
    { wch: 15 }, // Código
    { wch: maxWidth }, // Descripción
    { wch: 15 }, // Marca
    { wch: 12 }, // Categoría
    { wch: 15 }, // Similitud
  ];
  worksheet['!cols'] = wscols;

  XLSX.writeFile(workbook, `duplicados_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportToCSV(grupos: GrupoDuplicados[]) {
  const headers = [
    'Grupo ID',
    'Estado',
    'Confianza (%)',
    'Análisis OpenAI',
    'Producto ID',
    'Código',
    'Descripción',
    'Marca',
    'Categoría',
    'Similitud (%)',
  ];

  const rows: string[][] = [headers];

  grupos.forEach((grupo) => {
    grupo.productos.forEach((producto) => {
      rows.push([
        grupo.id.toString(),
        grupo.estado.replace('_', ' '),
        grupo.confianza?.toString() || 'N/A',
        grupo.analisisOpenAI || 'N/A',
        producto.id.toString(),
        producto.codigo,
        producto.descripcion,
        producto.marca,
        producto.categoria,
        (producto.similitudConPrincipal * 100).toFixed(2),
      ]);
    });
  });

  const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `duplicados_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}