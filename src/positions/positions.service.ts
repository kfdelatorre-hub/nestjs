import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { OkPacket } from 'mysql2';

@Injectable()
export class PositionsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  // ✅ Create new position
  async create(position_code: string, position_name: string, userId: number) {
    if (!userId) {
      throw new Error('User ID is missing');
    }

    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO positions (position_code, position_name, id) VALUES (?, ?, ?)',
      [position_code, position_name, userId],
    );

    return { position_id: result.insertId, position_code, position_name, userId };
  }

  // ✅ Get all positions
  async getAll() {
    const [rows] = await this.pool().execute('SELECT * FROM positions');
    return rows;
  }

  // ✅ Get one position by ID
  async getOne(id: number) {
    const [rows] = await this.pool().execute('SELECT * FROM positions WHERE position_id = ?', [id]);
    return (rows as any)[0];
  }

  // ✅ Update position details
  async update(id: number, body: any) {
    const fields: string[] = [];
    const values: any[] = [];

    if (body.position_code) {
      fields.push('position_code = ?');
      values.push(body.position_code);
    }

    if (body.position_name) {
      fields.push('position_name = ?');
      values.push(body.position_name);
    }

    if (!fields.length) return this.getOne(id);

    values.push(id);
    const sql = `UPDATE positions SET ${fields.join(', ')} WHERE position_id = ?`;
    await this.pool().execute(sql, values);

    return this.getOne(id);
  }

  // ✅ Delete a position
  async delete(id: number) {
    const [res] = await this.pool().execute('DELETE FROM positions WHERE position_id = ?', [id]);
    return (res as any).affectedRows > 0;
  }
}
