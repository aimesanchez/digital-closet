import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

import SafeScreen from "../components/SafeScreen";
import { colors } from "../constants/colors";
import { useProfile } from "../context/ProfileContext";

export default function PersonalInformationScreen({
  navigation,
}) {
  const {
    profile,
    saveProfile,
    isProfileLoaded,
  } = useProfile();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    if (!isProfileLoaded) {
      return;
    }

    setName(profile.name || "");
    setEmail(profile.email || "");
    setPhone(profile.phone || "");
  }, [
    profile,
    isProfileLoaded,
  ]);

  const handleSave = async () => {
    const trimmedName =
      name.trim();

    const trimmedEmail =
      email.trim();

    const trimmedPhone =
      phone.trim();

    if (!trimmedName) {
      Alert.alert(
        "Name Required",
        "Please enter your name."
      );

      return;
    }

    if (
      !trimmedEmail &&
      !trimmedPhone
    ) {
      Alert.alert(
        "Contact Information Required",
        "Please enter an email address or phone number."
      );

      return;
    }

    if (
      trimmedEmail &&
      !trimmedEmail.includes("@")
    ) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address."
      );

      return;
    }

    try {
      setIsSaving(true);

      const saved =
        await saveProfile({
          ...profile,
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
        });

      if (saved) {
        Alert.alert(
          "Profile Saved",
          "Your personal information has been updated.",
          [
            {
              text: "OK",
              onPress: () =>
                navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert(
          "Couldn't Save Profile",
          "Something went wrong while saving your information."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.container
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          <Text style={styles.title}>
            Personal Information
          </Text>

          <Text style={styles.subtitle}>
            Update your profile details.
          </Text>

          <Text style={styles.label}>
            Name
          </Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={
              colors.secondaryText
            }
            autoCapitalize="words"
          />

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={
              colors.secondaryText
            }
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>
            Phone
          </Text>

          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            placeholderTextColor={
              colors.secondaryText
            }
            keyboardType="phone-pad"
          />

          <Text style={styles.hint}>
            Add at least one contact method:
            email or phone.
          </Text>

          <Pressable
            style={[
              styles.saveButton,
              isSaving &&
                styles.saveButtonDisabled,
            ]}
            disabled={isSaving}
            onPress={handleSave}
          >
            <Text
              style={styles.saveButtonText}
            >
              {isSaving
                ? "Saving..."
                : "Save Changes"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },

  title: {
    fontSize: 27,
    fontWeight: "700",
    color: colors.text,
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 30,
    fontSize: 14,
    color: colors.secondaryText,
  },

  label: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },

  input: {
    minHeight: 54,
    marginBottom: 20,
    paddingHorizontal: 16,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,

    fontSize: 15,
    color: colors.text,
  },

  hint: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.secondaryText,
  },

  saveButton: {
    minHeight: 54,
    marginTop: 28,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: colors.accent,
    borderRadius: 18,
  },

  saveButtonDisabled: {
    opacity: 0.5,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});