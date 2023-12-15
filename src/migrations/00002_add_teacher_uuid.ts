import { sql } from 'kysely';
import { DatabaseService } from '../database';

export async function up(database: DatabaseService): Promise<void> {
  await database.executeQuery(
    sql`
      CREATE OR REPLACE FUNCTION generate_teacher_id()
      RETURNS VARCHAR(50) AS $$
      DECLARE
        max_id VARCHAR(50);
        prefix VARCHAR(3) := 'TEA';
        number_part INT;
        next_id VARCHAR(50);
      BEGIN
        -- Find the maximum existing ID
        SELECT MAX(id) INTO max_id FROM student;

        -- Initialize the parts of the ID
        IF max_id IS NOT NULL THEN
          number_part := CAST(SUBSTRING(max_id FROM 5) AS INT);
        ELSE
          number_part := 0;
        END IF;

        -- Increment the number part or change the prefix if necessary
        IF number_part < 999 THEN
          next_id := prefix || '-' || LPAD((number_part + 1)::VARCHAR, 3, '0');
        ELSE
          prefix := 'TEA-0'; -- Change the prefix
          next_id := prefix || LPAD('0000' || (number_part + 1)::VARCHAR, 4, '0');
        END IF;

        RETURN next_id;
      END;
      $$ LANGUAGE plpgsql;
    `.compile(database),
  );
}

export async function down(database: DatabaseService): Promise<void> {
  await database.executeQuery(
    sql`
      DROP FUNCTION IF EXISTS generate_teacher_id();
    `.compile(database),
  );
}
