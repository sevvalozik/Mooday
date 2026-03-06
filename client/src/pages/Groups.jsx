import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { Input } from '../components/ui/Input.jsx';
import { CardSkeleton } from '../components/ui/Skeleton.jsx';
import { EMOTIONS } from '../utils/emotionConfig.js';
import * as groupService from '../services/groupService.js';
import { toast } from '../components/ui/Toast.jsx';

export const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    groupService.getGroups()
      .then(setGroups)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!newGroupName.trim()) return;
    try {
      const group = await groupService.createGroup({ name: newGroupName.trim() });
      setGroups((prev) => [group, ...prev]);
      setNewGroupName('');
      setShowCreate(false);
      toast('Group created!', 'success');
    } catch {
      toast('Failed to create group', 'error');
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Groups</h1>
          <Button onClick={() => setShowCreate(true)}>Create Group</Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <>
            {/* Group List */}
            <div className="grid gap-4 md:grid-cols-2">
              {groups.map((group) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10"
                  onClick={() => setSelectedGroup(group)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{group.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-white">{group.name}</h3>
                      <p className="text-sm text-gray-400">{group._count?.members || group.members?.length || 0} members</p>
                    </div>
                  </div>
                  {/* Member spheres preview */}
                  <div className="mt-3 flex gap-2">
                    {(group.members || []).slice(0, 5).map((member) => {
                      const emotion = member.user?.moodLogs?.[0]?.emotion || 'calm';
                      return (
                        <div key={member.id} className="flex flex-col items-center gap-1">
                          <div className="h-8 w-8 rounded-full" style={{ backgroundColor: EMOTIONS[emotion]?.color + '40' }}>
                            <div className="flex h-full w-full items-center justify-center text-xs">
                              {EMOTIONS[emotion]?.icon}
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-500">{member.user?.username}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            {groups.length === 0 && (
              <p className="text-center text-gray-500">No groups yet. Create one to get started!</p>
            )}
          </>
        )}

        {/* Create Modal */}
        <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Group">
          <div className="flex flex-col gap-4">
            <Input
              label="Group Name"
              placeholder="Close Friends"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <Button onClick={handleCreate} disabled={!newGroupName.trim()}>
              Create
            </Button>
          </div>
        </Modal>

        {/* Group Detail Modal */}
        <Modal
          isOpen={!!selectedGroup}
          onClose={() => setSelectedGroup(null)}
          title={selectedGroup?.name}
        >
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-400">Members</p>
            {selectedGroup?.members?.map((member) => {
              const emotion = member.user?.moodLogs?.[0]?.emotion || 'calm';
              const config = EMOTIONS[emotion] || EMOTIONS.calm;
              return (
                <div key={member.id} className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-lg">{config.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{member.user?.displayName}</p>
                    <p className="text-xs text-gray-400">@{member.user?.username}</p>
                  </div>
                  <span className="ml-auto text-xs" style={{ color: config.color }}>{config.label}</span>
                </div>
              );
            })}
          </div>
        </Modal>
      </div>
    </PageWrapper>
  );
};
