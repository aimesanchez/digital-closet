import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as FileSystem from "expo-file-system/legacy";

const ProfileContext =
  createContext();

const PROFILE_DATA_FILE =
  `${FileSystem.documentDirectory}profile-data.json`;

export function ProfileProvider({
  children,
}) {
  const [profile, setProfile] =
    useState({
      name: "",
      email: "",
      phone: "",
      profileImageUri: "",
    });

  const [
    isProfileLoaded,
    setIsProfileLoaded,
  ] = useState(false);

  /* -------------------------------- */
  /* LOAD PROFILE                     */
  /* -------------------------------- */

  useEffect(() => {
    const loadProfile =
      async () => {
        try {
          const fileInfo =
            await FileSystem.getInfoAsync(
              PROFILE_DATA_FILE
            );

          if (!fileInfo.exists) {
            console.log(
              "No saved profile found."
            );
            return;
          }

          const savedData =
            await FileSystem.readAsStringAsync(
              PROFILE_DATA_FILE
            );

          const parsedProfile =
            JSON.parse(savedData);

          setProfile(
            parsedProfile
          );

          console.log(
            "Profile loaded."
          );
        } catch (error) {
          console.error(
            "Error loading profile:",
            error
          );
        } finally {
          setIsProfileLoaded(
            true
          );
        }
      };

    loadProfile();
  }, []);

  /* -------------------------------- */
  /* SAVE PROFILE                     */
  /* -------------------------------- */

  const saveProfile = async (
    updatedProfile
  ) => {
    try {
      const profileToSave = {
        name:
          updatedProfile.name
            ?.trim() || "",

        email:
          updatedProfile.email
            ?.trim() || "",

        phone:
          updatedProfile.phone
            ?.trim() || "",
        
        profileImageUri:
        updatedProfile.profileImageUri ||
        profile.profileImageUri ||
        "",
      };

      await FileSystem.writeAsStringAsync(
        PROFILE_DATA_FILE,
        JSON.stringify(
          profileToSave
        )
      );

      setProfile(
        profileToSave
      );

      console.log(
        "Profile saved."
      );

      return true;
    } catch (error) {
      console.error(
        "Error saving profile:",
        error
      );

      return false;
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        saveProfile,
        isProfileLoaded,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(
    ProfileContext
  );
}