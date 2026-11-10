import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GroomingCardProps {
  clientName: string;
  pet: string;
  service: string;
}

const GroomingCard: FC<GroomingCardProps> = React.memo(({ clientName, pet, service }) => {
  return (
    <View>
      <View style={styles.topRow}>
        <Text style={styles.clientText} numberOfLines={1}>
          {clientName}
        </Text>
        <View style={styles.badgeConfirmed}>
          <Text style={styles.badgeText}>Confirmed</Text>
        </View>
      </View>
      <Text style={styles.subText} numberOfLines={1}>
        {[pet, service].filter(Boolean).join(' • ')}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientText: {
    fontFamily: 'Source Sans 3',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D2B52',
    flex: 1,
    marginRight: 8,
  },
  badgeConfirmed: {
    backgroundColor: '#2D8A81',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  subText: {
    fontFamily: 'Source Sans 3',
    fontSize: 13,
    color: '#5E6E8C',
  },
});

export default GroomingCard;

GroomingCard.displayName = 'GroomingCard';
