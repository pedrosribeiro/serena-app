import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Cria usuários
  const doctor = await prisma.user.create({
    data: {
      name: 'Dr. Alice',
      email: 'alice@doctor.com',
      passwordHash: 'hash1',
      role: 'doctor',
    },
  });

  const caregiver = await prisma.user.create({
    data: {
      name: 'Bob Caregiver',
      email: 'bob@care.com',
      passwordHash: 'hash2',
      role: 'caregiver',
    },
  });

  // Cria idosos
  const senior1 = await prisma.senior.create({
    data: {
      name: 'Maria Silva',
      birthDate: new Date('1940-05-10'),
      identifier: 'maria1940@email.com',
      caregivers: { connect: [{ id: caregiver.id }] },
      doctors: { connect: [{ id: doctor.id }] },
    },
  });

  const senior2 = await prisma.senior.create({
    data: {
      name: 'João Souza',
      birthDate: new Date('1935-11-22'),
      identifier: 'joao1935@email.com',
      caregivers: { connect: [{ id: caregiver.id }] },
      doctors: { connect: [{ id: doctor.id }] },
    },
  });

  // Cria medicamentos
  const med1 = await prisma.medication.create({
    data: { name: 'Paracetamol', description: 'Analgesic' },
  });
  const med2 = await prisma.medication.create({
    data: { name: 'Aspirina', description: 'Antiplatelet' },
  });

  // Cria sintomas
  await prisma.symptom.createMany({
    data: [
      {
        seniorId: senior1.id,
        description: 'Dor de cabeça',
        painLevel: 6,
      },
      {
        seniorId: senior2.id,
        description: 'Fadiga',
        painLevel: 4,
      },
    ],
  });

  // Cria prescrições
  await prisma.prescription.createMany({
    data: [
      {
        seniorId: senior1.id,
        medicationId: med1.id,
        dosage: '1 comprimido',
        frequency: 'a cada 8h',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        seniorId: senior2.id,
        medicationId: med2.id,
        dosage: '1 comprimido',
        frequency: 'a cada 12h',
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    ],
  });
}

main().finally(() => prisma.$disconnect());
