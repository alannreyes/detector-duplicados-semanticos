import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, IsNull } from 'typeorm';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  async findAll(): Promise<Producto[]> {
    return this.productosRepository.find({
      where: { activo: true },
      take: 100, // Limitar por defecto
    });
  }

  async findById(id: number): Promise<Producto> {
    return this.productosRepository.findOne({ where: { id } });
  }

  async findByRange(startId: number, endId: number): Promise<Producto[]> {
    return this.productosRepository.find({
      where: {
        id: Between(startId, endId),
        activo: true,
        embedding: Not(IsNull()),
      },
      order: { id: 'ASC' },
    });
  }

  async findByCategoria(categoria: string): Promise<Producto[]> {
    return this.productosRepository.find({
      where: {
        categoria,
        activo: true,
        embedding: Not(IsNull()),
      },
    });
  }

  async countTotal(): Promise<number> {
    return this.productosRepository.count({
      where: { activo: true }
    });
  }

  async getAllWithEmbeddings(): Promise<Producto[]> {
    return this.productosRepository
      .createQueryBuilder('producto')
      .where('producto.activo = :activo', { activo: true })
      .andWhere('producto.embedding IS NOT NULL')
      .andWhere("producto.embedding != '[]'")
      .getMany();
  }
}