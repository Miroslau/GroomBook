import React, { FC, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DARK_THEME } from '../../constants/theme';

interface GroomingCardProps {
  clientName: string;
  pet?: string;
  service?: string;
  statusLabel?: string;
}

const GroomingCard: FC<GroomingCardProps> = React.memo(
  ({ clientName, pet, service, statusLabel = 'Записан' }) => {
    const detailsText = useMemo(() => {
      return [pet?.trim(), service?.trim()].filter(Boolean).join(' • ');
    }, [pet, service]);
    return (
      <View style={styles.card}>
        <View style={styles.accentBar} />
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.clientName} numberOfLines={1} ellipsizeMode="tail">
              {clientName}
            </Text>
            {Boolean(statusLabel) && (
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>{statusLabel}</Text>
              </View>
            )}
          </View>
          {Boolean(detailsText) && (
            <Text style={styles.detailsText} numberOfLines={1} ellipsizeMode="tail">
              {detailsText}
            </Text>
          )}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DARK_THEME.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: DARK_THEME.borderStrong,
    overflow: 'hidden',
  },
  accentBar: {
    width: 4,
    height: '100%',
    backgroundColor: DARK_THEME.statusConfirmedText,
  },
  content: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  clientName: {
    flex: 1,
    fontFamily: 'Source Sans 3',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    color: DARK_THEME.textPrimary,
  },
  statusBadge: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: DARK_THEME.statusConfirmedBg,
    borderWidth: 1,
    borderColor: DARK_THEME.statusConfirmedBorder,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: DARK_THEME.statusConfirmedText,
  },
  statusText: {
    fontFamily: 'Source Sans 3',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    color: DARK_THEME.statusConfirmedText,
  },
  detailsText: {
    fontFamily: 'Source Sans 3',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    color: DARK_THEME.textSecondary,
  },
});

export default GroomingCard;

GroomingCard.displayName = 'GroomingCard';
