import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('productos_bip')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo: string;

  @Column({ nullable: true })
  codigo_fabrica: string;

  @Column()
  descripcion: string;

  @Column({ nullable: true })
  descripcion_original: string;

  @Column({ nullable: true })
  descripcion_expandida: string;

  @Column()
  marca: string;

  @Column()
  unidad_medida: string;

  @Column()
  categoria: string;

  @Column({ nullable: true })
  subcategoria: string;

  @Column({ nullable: true })
  familia: string;

  @Column()
  segment: string;

  @Column({ type: 'text' })
  embedding: string; // Almacenado como JSON string

  @Column({ nullable: true })
  embedding_modelo: string;

  @Column({ type: 'timestamp', nullable: true })
  embedding_fecha: Date;

  @Column({ type: 'decimal', nullable: true })
  prioridad_comercial: number;

  @Column({ nullable: true })
  categoria_comercial: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_actualizacion: Date;

  // Método helper para obtener el embedding como array
  getEmbeddingArray(): number[] {
    try {
      return JSON.parse(this.embedding);
    } catch (e) {
      console.error('Error parsing embedding:', e);
      return [];
    }
  }
}