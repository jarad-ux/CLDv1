/**
 * Signatures Screen
 * Step 14: Capture customer and advisor digital signatures
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AssessmentFlowParamList } from '@/navigation/AssessmentFlowNavigator';
import { useAssessmentStore } from '@/store/assessmentStore';
import { Signature } from '@/models/Assessment';
import SignatureCanvas from 'react-native-signature-canvas';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

type SignaturesNavigationProp = StackNavigationProp<AssessmentFlowParamList, 'Signatures'>;

interface Props {
  navigation: SignaturesNavigationProp;
}

const SignaturesScreen: React.FC<Props> = ({ navigation }) => {
  const { currentAssessment, addSignature, updateCurrentAssessment, saveCurrentAssessment, endAssessment } =
    useAssessmentStore();

  const signatureRef = useRef<any>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [currentSignatureType, setCurrentSignatureType] = useState<'customer' | 'advisor'>('customer');
  const [printedName, setPrintedName] = useState('');

  // Acknowledgment states
  const [ack1, setAck1] = useState(false);
  const [ack2, setAck2] = useState(false);
  const [ack3, setAck3] = useState(false);
  const [ack4, setAck4] = useState(false);
  const [ack5, setAck5] = useState(false);
  const [ack6, setAck6] = useState(false);
  const [ack7, setAck7] = useState(false);

  const customerSignature = currentAssessment?.signatures.find((s) => s.type === 'customer');
  const advisorSignature = currentAssessment?.signatures.find((s) => s.type === 'advisor');

  const handleOpenSignaturePad = (type: 'customer' | 'advisor') => {
    setCurrentSignatureType(type);
    setPrintedName(type === 'customer' ? currentAssessment?.customer.name || '' : currentAssessment?.metadata.advisorName || '');
    setShowSignatureModal(true);
  };

  const handleSignature = (signature: string) => {
    if (!printedName.trim()) {
      Alert.alert('Required', 'Please enter the printed name');
      return;
    }

    const newSignature: Signature = {
      id: uuidv4(),
      type: currentSignatureType,
      signatureDataUrl: signature,
      printedName: printedName.trim(),
      timestamp: new Date(),
    };

    addSignature(newSignature);
    setShowSignatureModal(false);
    saveCurrentAssessment();
  };

  const handleClearSignature = () => {
    signatureRef.current?.clearSignature();
  };

  const handleNext = async () => {
    // Validate acknowledgments
    if (!ack1 || !ack2 || !ack3 || !ack4 || !ack5 || !ack6 || !ack7) {
      Alert.alert('Required', 'All acknowledgment items must be checked');
      return;
    }

    // Validate signatures
    if (!customerSignature) {
      Alert.alert('Required', 'Customer signature is required');
      return;
    }

    if (!advisorSignature) {
      Alert.alert('Required', 'Advisor signature is required');
      return;
    }

    // Update acknowledgment
    updateCurrentAssessment({
      customerAcknowledgment: {
        receivedComprehensiveAssessment: ack1,
        discussedEnergyBills: ack2,
        understandsRecommendations: ack3,
        receivedRebateInformation: ack4,
        understandsStateProgramExclusive: ack5,
        paidAssessmentFee: ack6,
        allPhotosSubmitted: ack7,
        acknowledgedAt: new Date(),
      },
    });

    // Mark assessment as completed
    endAssessment();

    await saveCurrentAssessment();
    navigation.navigate('Review');
  };

  const renderSignatureCard = (
    type: 'customer' | 'advisor',
    signature: Signature | undefined,
    title: string
  ) => (
    <View style={styles.signatureCard}>
      <Text style={styles.signatureCardTitle}>{title}</Text>

      {signature ? (
        <View style={styles.signaturePreview}>
          <Text style={styles.signedText}>✓ Signed</Text>
          <Text style={styles.printedNameText}>{signature.printedName}</Text>
          <Text style={styles.timestampText}>
            {format(new Date(signature.timestamp), 'MMM d, yyyy h:mm a')}
          </Text>
          <TouchableOpacity
            style={styles.resignButton}
            onPress={() => handleOpenSignaturePad(type)}
          >
            <Icon name="edit" size={16} color="#0066CC" />
            <Text style={styles.resignButtonText}>Re-sign</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.signButton}
          onPress={() => handleOpenSignaturePad(type)}
        >
          <Icon name="gesture" size={24} color="#fff" />
          <Text style={styles.signButtonText}>Click to Sign</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Customer Acknowledgment</Text>

          <View style={styles.acknowledgmentBox}>
            <Text style={styles.acknowledgmentIntro}>
              I acknowledge and confirm the following:
            </Text>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => setAck1(!ack1)}>
              <Icon
                name={ack1 ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color={ack1 ? '#0066CC' : '#999'}
              />
              <Text style={styles.checkboxText}>
                I have received a comprehensive home energy assessment lasting 90+ minutes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => setAck2(!ack2)}>
              <Icon
                name={ack2 ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color={ack2 ? '#0066CC' : '#999'}
              />
              <Text style={styles.checkboxText}>
                The energy advisor discussed my energy bills, usage patterns, and comfort concerns
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => setAck3(!ack3)}>
              <Icon
                name={ack3 ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color={ack3 ? '#0066CC' : '#999'}
              />
              <Text style={styles.checkboxText}>
                I understand the recommended improvements and available rebate programs
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => setAck4(!ack4)}>
              <Icon
                name={ack4 ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color={ack4 ? '#0066CC' : '#999'}
              />
              <Text style={styles.checkboxText}>
                I received information about Georgia Power HEIP, state HEAR/HER, and federal tax credits
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => setAck5(!ack5)}>
              <Icon
                name={ack5 ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color={ack5 ? '#0066CC' : '#999'}
              />
              <Text style={styles.checkboxText}>
                I understand that state programs are mutually exclusive (choose only ONE)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => setAck6(!ack6)}>
              <Icon
                name={ack6 ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color={ack6 ? '#0066CC' : '#999'}
              />
              <Text style={styles.checkboxText}>
                I paid the $150 assessment fee and may qualify for Georgia Power $150 rebate
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => setAck7(!ack7)}>
              <Icon
                name={ack7 ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color={ack7 ? '#0066CC' : '#999'}
              />
              <Text style={styles.checkboxText}>
                All required photos were captured and will be submitted for verification
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Digital Signatures</Text>

          {renderSignatureCard('customer', customerSignature, 'Customer Signature')}
          {renderSignatureCard('advisor', advisorSignature, 'Energy Advisor Signature')}

          <View style={styles.infoBox}>
            <Icon name="info" size={20} color="#0066CC" />
            <Text style={styles.infoText}>
              Digital signatures are legally binding and will be included in the final HEIP
              assessment report submitted to Georgia Power.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next: Review & Submit</Text>
          <Icon name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showSignatureModal}
        animationType="slide"
        onRequestClose={() => setShowSignatureModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {currentSignatureType === 'customer' ? 'Customer' : 'Advisor'} Signature
            </Text>
            <TouchableOpacity onPress={() => setShowSignatureModal(false)}>
              <Icon name="close" size={28} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.nameInputContainer}>
            <Text style={styles.nameInputLabel}>Printed Name:</Text>
            <TextInput
              style={styles.nameInput}
              value={printedName}
              onChangeText={setPrintedName}
              placeholder="Enter full name"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.signatureCanvasContainer}>
            <SignatureCanvas
              ref={signatureRef}
              onOK={handleSignature}
              descriptionText="Sign above"
              clearText="Clear"
              confirmText="Save"
              webStyle={`.m-signature-pad {box-shadow: none; border: 2px solid #e0e0e0; border-radius: 8px;} .m-signature-pad--body {border: none;} .m-signature-pad--footer {display: none;}`}
            />
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearSignature}>
              <Icon name="refresh" size={20} color="#F44336" />
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => signatureRef.current?.readSignature()}
            >
              <Icon name="check" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save Signature</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  acknowledgmentBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  acknowledgmentIntro: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    lineHeight: 20,
  },
  signatureCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  signatureCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  signaturePreview: {
    alignItems: 'center',
    padding: 15,
  },
  signedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  printedNameText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  timestampText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  resignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  resignButtonText: {
    color: '#0066CC',
    fontSize: 14,
    marginLeft: 6,
  },
  signButton: {
    backgroundColor: '#0066CC',
    padding: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#0066CC',
    marginLeft: 10,
    lineHeight: 18,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  nextButton: {
    backgroundColor: '#0066CC',
    padding: 18,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  nameInputContainer: {
    padding: 20,
  },
  nameInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  signatureCanvasContainer: {
    flex: 1,
    margin: 20,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default SignaturesScreen;
