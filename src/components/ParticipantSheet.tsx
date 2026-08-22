import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import type { ScannerVerifyResponse } from '@/types/api';

interface ParticipantSheetProps {
  result: ScannerVerifyResponse;
  onConfirmCheckIn?: () => void;
  onDismiss?: () => void;
  loading?: boolean;
}

export function ParticipantSheet({
  result,
  onConfirmCheckIn,
  onDismiss,
  loading = false,
}: ParticipantSheetProps) {
  const { participant, event, attended, registrationId } = result;

  // Name initials (උදා: Kasun Fernando -> KF)
  const initials = participant.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <View style={styles.sheet}>
      {/* Top Handle Line */}
      <View style={styles.handle} />

      {/* Member 2 Scope Identifier Tag */}
      <View style={styles.memberTag}>
        <Text style={styles.memberTagText}>MEMBER 2: ATTENDEE TICKET METADATA VIEW</Text>
      </View>

      {/* Header Avatar & Info */}
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{participant.fullName}</Text>
          <Text style={styles.email}>{participant.email}</Text>
        </View>

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: attended ? '#FEF3C7' : '#D1FAE5' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: attended ? '#B4890F' : '#065F46' },
            ]}
          >
            {attended ? 'Already Checked In' : 'Valid Ticket'}
          </Text>
        </View>
      </View>

      {/* Ticket Details Divider */}
      <View style={styles.divider} />

      {/* Metadata Fields */}
      <View style={styles.metadataContainer}>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Event</Text>
          <Text style={styles.metaValue}>{event.name}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Registration ID</Text>
          <Text style={styles.metaValueMono}>{registrationId.substring(0, 16)}...</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        {onDismiss && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onDismiss}
            disabled={loading}
          >
            <Text style={styles.cancelText}>Dismiss</Text>
          </TouchableOpacity>
        )}

        {!attended && onConfirmCheckIn && (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={onConfirmCheckIn}
            disabled={loading}
          >
            <Text style={styles.confirmText}>
              {loading ? 'Verifying...' : 'Verify Ticket'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  memberTag: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  memberTagText: {
    fontSize: 10,
    fontFamily: 'Urbanist_700Bold',
    color: '#184F95',
    letterSpacing: 0.5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#184F95',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Urbanist_800ExtraBold',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Urbanist_700Bold',
    color: '#111827',
  },
  email: {
    fontSize: 13,
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Urbanist_700Bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  metadataContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  metaLabel: {
    fontSize: 13,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#6B7280',
  },
  metaValue: {
    fontSize: 13,
    fontFamily: 'Urbanist_700Bold',
    color: '#111827',
  },
  metaValueMono: {
    fontSize: 13,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#4B5563',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelText: {
    color: '#374151',
    fontFamily: 'Urbanist_600SemiBold',
    fontSize: 14,
  },
  confirmButton: {
    flex: 2,
    backgroundColor: '#184F95',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: {
    color: '#FFFFFF',
    fontFamily: 'Urbanist_700Bold',
    fontSize: 14,
  },
});
