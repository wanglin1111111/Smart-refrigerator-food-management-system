import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/page/page-header';
import { Empty } from '@/components/shared/feedback/empty';
import { Button } from '@/components/shared/buttons/button';
import { useShareStore } from '@/store/share-store';
import { Analytics } from '@/lib/analytics';

export function SharePage() {
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState('');

  const members = useShareStore((state) => state.members);
  const addMember = useShareStore((state) => state.addMember);
  const removeMember = useShareStore((state) => state.removeMember);

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    if (newEmail.trim()) {
      addMember(newEmail.trim());
      Analytics.shareInvite(newEmail.trim());
      setNewEmail('');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <PageHeader
        title="全家共享"
        subtitle={`${members.length} 位成员`}
        rightAction={
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        }
      />

      <form className="mt-6 flex gap-2" onSubmit={handleAdd}>
        <input
          value={newEmail}
          onChange={(event) => setNewEmail(event.target.value)}
          placeholder="输入成员邮箱邀请..."
          type="email"
          className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <Button type="submit">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      {members.length === 0 ? (
        <Empty
          message="还没有共享成员"
          actionLabel="邀请家人"
          onAction={() => {}}
        />
      ) : (
        <div className="mt-6 space-y-2">
          <ul className="space-y-2">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{member.email}</p>
                  <p className="text-xs text-gray-400">
                    {member.role === 'owner' ? '管理员' : '成员'} · {formatDate(member.joinedAt)}
                  </p>
                </div>

                {member.role !== 'owner' && (
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-danger transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-primary/5 p-4">
            <p className="text-xs text-gray-600">
              共享后，家人可以查看和编辑冰箱食材、购物清单，一起管理家庭饮食。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
