import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export type AnotacaoLocal = { text: string; type: 'positive' | 'negative' };

export type PontoMapa = { id: string; lat: number; long: number };

const COLECAO_LOCAIS = 'locais';

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

export async function uploadFotoLocal(uri: string, userId: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const nomeArquivo = `${Date.now()}.jpg`;
  const storageRef = ref(storage, `locaisFotos/${userId}/${nomeArquivo}`);
  await uploadBytes(storageRef, blob, {
    contentType: blob.type && blob.type !== '' ? blob.type : 'image/jpeg',
  });
  return getDownloadURL(storageRef);
}

export async function criarLocalNoFirebase(input: {
  nome: string;
  lat: number;
  long: number;
  anotacoes: AnotacaoLocal[];
  fotoUrl: string | null;
  criadoPor: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, COLECAO_LOCAIS), {
    nome: input.nome,
    lat: input.lat,
    long: input.long,
    anotacoes: input.anotacoes,
    fotoUrl: input.fotoUrl,
    criadoPor: input.criadoPor,
    criadoEm: serverTimestamp(),
  });
  return docRef.id;
}
