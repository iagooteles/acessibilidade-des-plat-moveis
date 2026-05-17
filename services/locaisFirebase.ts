import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export type AnotacaoLocal = { text: string; type: 'positive' | 'negative' };

export type PontoMapa = { id: string; lat: number; long: number };

export type LocalFirebase = PontoMapa & {
  nome: string;
  anotacoes: AnotacaoLocal[];
  fotoUrl: string | null;
  fotoBase64: string | null;
  criadoPor: string | null;
};

const COLECAO_LOCAIS = 'locais';

function normalizarAnotacoes(value: unknown): AnotacaoLocal[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is AnotacaoLocal => {
    if (!item || typeof item !== 'object') {
      return false;
    }

    const anotacao = item as Record<string, unknown>;
    return (
      typeof anotacao.text === 'string' &&
      (anotacao.type === 'positive' || anotacao.type === 'negative')
    );
  });
}

export async function listarLocaisParaMapa(): Promise<PontoMapa[]> {
  const snap = await getDocs(collection(db, COLECAO_LOCAIS));
  const pontos: PontoMapa[] = [];
  for (const docSnap of snap.docs) {
    const dadosDoDocumento = docSnap.data() as Record<string, unknown>;
    const lat = Number(dadosDoDocumento.lat);
    const long = Number(dadosDoDocumento.long);
    if (Number.isFinite(lat) && Number.isFinite(long)) {
      pontos.push({ id: docSnap.id, lat, long });
    }
  }
  return pontos;
}

export async function listarLocais(): Promise<LocalFirebase[]> {
  const snap = await getDocs(collection(db, COLECAO_LOCAIS));
  const locais: LocalFirebase[] = [];

  for (const docSnap of snap.docs) {
    const dadosDoDocumento = docSnap.data() as Record<string, unknown>;
    const lat = Number(dadosDoDocumento.lat);
    const long = Number(dadosDoDocumento.long);

    if (!Number.isFinite(lat) || !Number.isFinite(long)) {
      continue;
    }

    locais.push({
      id: docSnap.id,
      nome:
        typeof dadosDoDocumento.nome === 'string' && dadosDoDocumento.nome.trim()
          ? dadosDoDocumento.nome
          : 'Local sem nome',
      lat,
      long,
      anotacoes: normalizarAnotacoes(dadosDoDocumento.anotacoes),
      fotoUrl:
        typeof dadosDoDocumento.fotoUrl === 'string' && dadosDoDocumento.fotoUrl
          ? dadosDoDocumento.fotoUrl
          : null,
      fotoBase64:
        typeof dadosDoDocumento.fotoBase64 === 'string' && dadosDoDocumento.fotoBase64
          ? dadosDoDocumento.fotoBase64
          : null,
      criadoPor:
        typeof dadosDoDocumento.criadoPor === 'string' && dadosDoDocumento.criadoPor
          ? dadosDoDocumento.criadoPor
          : null,
    });
  }

  return locais;
}

export async function criarLocalNoFirebase(input: {
  nome: string;
  lat: number;
  long: number;
  anotacoes: AnotacaoLocal[];
  fotoBase64: string | null;
  criadoPor: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, COLECAO_LOCAIS), {
    nome: input.nome,
    lat: input.lat,
    long: input.long,
    anotacoes: input.anotacoes,
    fotoBase64: input.fotoBase64,
    criadoPor: input.criadoPor,
    criadoEm: serverTimestamp(),
  });
  return docRef.id;
}

export async function editarLocalNoFirebase(input: {
  id: string;
  nome: string;
  anotacoes: AnotacaoLocal[];
  fotoBase64: string | null;
}): Promise<void> {
  await updateDoc(doc(db, COLECAO_LOCAIS, input.id), {
    nome: input.nome,
    anotacoes: input.anotacoes,
    fotoBase64: input.fotoBase64,
    atualizadoEm: serverTimestamp(),
  });
}

export async function excluirLocalNoFirebase(id: string): Promise<void> {
  await deleteDoc(doc(db, COLECAO_LOCAIS, id));
}
