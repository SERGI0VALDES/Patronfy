import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Patch, 
  UseInterceptors, 
  UploadedFile, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto'; 
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Configuración de almacenamiento reutilizable
const storageConfig = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

@UseGuards(JwtAuthGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('foto', { storage: storageConfig }))
  async crearCliente(
    @Body() createClienteDto: CreateClienteDto,
    @UploadedFile() foto: Express.Multer.File,
    @Request() req,
  ) {
    const usuarioId = req.user.id;
    return this.clientesService.create(createClienteDto, usuarioId, foto);
  }

  @Get()
  async listarMisClientes(@Request() req) {
    const usuarioId = req.user.id;
    return this.clientesService.findAll(usuarioId);
  }

  @Patch(':id') // 👈 Ahora sí funcionará
  @UseInterceptors(FileInterceptor('foto', { storage: storageConfig })) // 👈 Agregamos storageConfig
  async update(
    @Param('id') id: string, 
    @Body() updateClienteDto: UpdateClienteDto, 
    @UploadedFile() foto?: Express.Multer.File
  ) {
    return this.clientesService.update(id, updateClienteDto, foto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.clientesService.remove(id);
  }
}