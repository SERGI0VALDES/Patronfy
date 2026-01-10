-- AlterTable
ALTER TABLE "Patron" ADD COLUMN     "clienteId" TEXT;

-- AddForeignKey
ALTER TABLE "Patron" ADD CONSTRAINT "Patron_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
