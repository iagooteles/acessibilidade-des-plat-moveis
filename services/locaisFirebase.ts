import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';

import { db } from '../config/firebase';

export type AnotacaoLocal = {
  text: string;
  type: 'positive' | 'negative';
};

export type ComentarioLocal = {
  id: string;
  createdAt: Timestamp | null;
  texto: string;
  nomeAutor: string;
  uidAutor: string;
};

export type PontoMapa = {
  nome: string;
  id: string;
  lat: number;
  long: number;
  anotacoes: AnotacaoLocal[];
};

export type LocalFirebase = PontoMapa & {
  nome: string;
  anotacoes: AnotacaoLocal[];
  comentarios?: ComentarioLocal[];
  fotoUrl: string | null;
  fotoBase64: string | null;
  criadoPor: string | null;
};

const COLECAO_LOCAIS = 'locais';

function normalizarAnotacoes(value: unknown): AnotacaoLocal[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is AnotacaoLocal => {
    if (!item || typeof item !== 'object') return false;
    const anotacao = item as Record<string, unknown>;
    return (
      typeof anotacao.text === 'string' &&
      (anotacao.type === 'positive' || anotacao.type === 'negative')
    );
  });
}

function normalizarComentarioDoc(id: string, value: unknown): ComentarioLocal | null {
  if (!value || typeof value !== 'object') return null;

  const comentario = value as Record<string, unknown>;

  if (
    typeof comentario.texto !== 'string' ||
    typeof comentario.nomeAutor !== 'string' ||
    typeof comentario.uidAutor !== 'string'
  ) {
    return null;
  }

  return {
    id,
    texto: comentario.texto,
    nomeAutor: comentario.nomeAutor,
    uidAutor: comentario.uidAutor,
    createdAt:
       comentario.createdAt instanceof Timestamp
        ? comentario.createdAt
        : null,
  };
}

export async function listarComentariosDoLocal(localId: string): Promise<ComentarioLocal[]> {
  const comentariosRef = collection(
    db,
    COLECAO_LOCAIS,
    localId,
    'comentarios'
  );

  const snap = await getDocs(
    query(comentariosRef, orderBy('createdAt', 'desc'))
  );

  return snap.docs
    .map((docSnap) => normalizarComentarioDoc(docSnap.id, docSnap.data()))
    .filter((item): item is ComentarioLocal => item !== null);
}

export async function criarComentarioNoLocal(input: {
  localId: string;
  texto: string;
  nomeAutor: string;
  uidAutor: string;
}): Promise<string> {
  const docRef = await addDoc(
    collection(db, COLECAO_LOCAIS, input.localId, 'comentarios'),
    {
      texto: input.texto,
      nomeAutor: input.nomeAutor,
      uidAutor: input.uidAutor,
      createdAt: serverTimestamp(),
    }
  );

  return docRef.id;
}

export async function listarLocaisParaMapa(): Promise<PontoMapa[]> {
  const snap = await getDocs(collection(db, COLECAO_LOCAIS));
  const pontos: PontoMapa[] = [];
  for (const docSnap of snap.docs) {
    const dados = docSnap.data() as Record<string, unknown>;
    const lat = Number(dados.lat);
    const long = Number(dados.long);
    if (Number.isFinite(lat) && Number.isFinite(long)) {
      pontos.push({
         nome: 
          typeof dados.nome === 'string'
            ? dados.nome
            : 'Local',
          anotacoes: Array.isArray(dados.anotacoes)
            ? (dados.anotacoes as AnotacaoLocal[])
            : [],
         id: docSnap.id, lat, long
        });
    }
  }
  return pontos;
}

export async function listarLocais(): Promise<LocalFirebase[]> {
  const snap = await getDocs(collection(db, COLECAO_LOCAIS));
  const locais: LocalFirebase[] = [];

  for (const docSnap of snap.docs) {
    const dados = docSnap.data() as Record<string, unknown>;
    const lat = Number(dados.lat);
    const long = Number(dados.long);

    if (!Number.isFinite(lat) || !Number.isFinite(long)) continue;

    locais.push({
      id: docSnap.id,
      nome: typeof dados.nome === 'string' && dados.nome.trim() ? dados.nome : 'Local sem nome',
      lat,
      long,
      anotacoes: normalizarAnotacoes(dados.anotacoes),
      fotoUrl: typeof dados.fotoUrl === 'string' && dados.fotoUrl ? dados.fotoUrl : null,
      fotoBase64: typeof dados.fotoBase64 === 'string' && dados.fotoBase64 ? dados.fotoBase64 : null,
      criadoPor: typeof dados.criadoPor === 'string' && dados.criadoPor ? dados.criadoPor : null,
    });
  }

  return locais;
}

export async function buscarLocalPorId(id: string): Promise<LocalFirebase | null> {
  const snap = await getDoc(doc(db, COLECAO_LOCAIS, id));
  if (!snap.exists()) return null;

  const dados = snap.data() as Record<string, unknown>;
  const lat = Number(dados.lat);
  const long = Number(dados.long);

  if (!Number.isFinite(lat) || !Number.isFinite(long)) return null;

  return {
    id: snap.id,
    nome: typeof dados.nome === 'string' && dados.nome.trim() ? dados.nome : 'Local sem nome',
    lat,
    long,
    anotacoes: normalizarAnotacoes(dados.anotacoes),
    fotoUrl: typeof dados.fotoUrl === 'string' && dados.fotoUrl ? dados.fotoUrl : null,
    fotoBase64: typeof dados.fotoBase64 === 'string' && dados.fotoBase64 ? dados.fotoBase64 : null,
    criadoPor: typeof dados.criadoPor === 'string' && dados.criadoPor ? dados.criadoPor : null,
  };
}

export async function criarLocalNoFirebase(
  input: {
    nome: string;
    lat: number;
    long: number;
    anotacoes: AnotacaoLocal[];
    fotoBase64: string | null;
    criadoPor: string;
  }
): Promise<string> {
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

export async function editarLocalNoFirebase(
  input: {
    id: string;
    nome: string;
    anotacoes: AnotacaoLocal[];
    fotoBase64: string | null;
  }
): Promise<void> {
  await updateDoc(doc(db, COLECAO_LOCAIS, input.id), {
    nome: input.nome,
    anotacoes: input.anotacoes,
    fotoBase64: input.fotoBase64,
    atualizadoEm: serverTimestamp(),
  });
}

export async function atualizarLocalCompleto(
  input: {
    id: string;
    nome: string;
    anotacoes: AnotacaoLocal[];
    fotoBase64: string | null;
  }
): Promise<void> {
  await updateDoc(
    doc(
      db,
      COLECAO_LOCAIS,
      input.id
    ),
    {
      nome: input.nome,

      anotacoes:
        input.anotacoes,

      fotoBase64:
        input.fotoBase64,

      atualizadoEm:
        serverTimestamp(),
    }
  );
}

export async function excluirLocalNoFirebase(
  id: string
): Promise<void> {
  await deleteDoc(
    doc(db, COLECAO_LOCAIS, id)
  );
}