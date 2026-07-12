import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SharedMember {
  id: string;
  email: string;
  role: 'owner' | 'member';
  joinedAt: string;
}

interface ShareState {
  members: SharedMember[];
  addMember: (email: string) => void;
  removeMember: (id: string) => void;
  getOwnerEmail: () => string | undefined;
}

export const useShareStore = create<ShareState>()(
  persist(
    (set, get) => ({
      members: [],

      addMember: (email) => {
        set((state) => {
          if (state.members.some((m) => m.email === email)) {
            return state;
          }
          return {
            members: [
              ...state.members,
              {
                id: crypto.randomUUID(),
                email,
                role: state.members.length === 0 ? 'owner' : 'member',
                joinedAt: new Date().toISOString(),
              },
            ],
          };
        });
      },

      removeMember: (id) => {
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        }));
      },

      getOwnerEmail: () => {
        return get().members.find((m) => m.role === 'owner')?.email;
      },
    }),
    {
      name: 'fresh-know-share',
    }
  )
);
