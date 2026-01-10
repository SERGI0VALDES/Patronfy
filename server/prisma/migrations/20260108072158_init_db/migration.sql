-- AlterTable
ALTER TABLE "Patron" ADD COLUMN     "dificultad" TEXT,
ADD COLUMN     "estiloPrenda" JSONB,
ADD COLUMN     "instrucciones" JSONB,
ADD COLUMN     "nombreCliente" TEXT,
ADD COLUMN     "piezas" JSONB,
ADD COLUMN     "tipoPrenda" TEXT,
ADD COLUMN     "totalTela" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nombre" TEXT,
    "correo" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "notas" TEXT,
    "photoUri" TEXT,
    "totalPatrones" TEXT DEFAULT '0',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_correo_key" ON "Cliente"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_telefono_key" ON "Cliente"("telefono");
