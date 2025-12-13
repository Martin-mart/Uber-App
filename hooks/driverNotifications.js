import { useEffect } from 'react';
import { db, auth } from '../firebase';
import { onSnapshot, collection, query, where } from 'firebase/firestore';

export const useDriverNotifications = () => {
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'rides'),
      where('driver', '==', auth.currentUser.email),
      where('status', '==', 'Pending') // Only new assignments
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const ride = change.doc.data();
          if (Notification.permission === 'granted') {
            new Notification('New Ride Assigned', {
              body: `Pickup: ${ride.pickup?.join(', ')} → Dropoff: ${ride.dropoff?.join(', ')}`,
            });
          }
        }
      });
    });

    return () => unsubscribe();
  }, []);
};
