import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Avatar, Divider, List, useTheme as usePaperTheme, ProgressBar, Chip } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRaces } from '../context/RaceContext';
import { useAppTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const paperTheme = usePaperTheme();
  const { isDarkMode, theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { getRacesArray } = useRaces();
  
  // Use useMemo to prevent recalculation on every render
  const races = useMemo(() => getRacesArray(), [getRacesArray]);
  
  // Mock user data - in a real app, this would come from a user context or API
  const [userData, setUserData] = useState({
    name: 'Alex Runner',
    email: 'alex.runner@example.com',
    profileImage: null, // We'll use a placeholder
    location: 'Boulder, CO',
    bio: 'Ultra runner passionate about mountain trails and pushing limits. Completed 10+ ultras including Western States and UTMB.',
    stats: {
      racesPlanned: races.length,
      racesCompleted: 3,
      totalDistance: races.reduce((sum, race) => sum + race.distance, 0),
      appUsage: 15, // Number of times app used for planning
      longestRace: Math.max(...races.map(race => race.distance), 0),
    },
    achievements: [
      { id: '1', name: 'First Race Plan', icon: 'flag-outline', date: '2024-03-15' },
      { id: '2', name: 'Mountain Master', icon: 'mountain', date: '2024-04-01' },
      { id: '3', name: 'Nutrition Expert', icon: 'food-apple', date: '2024-04-10' },
    ],
    preferences: {
      distanceUnit: 'miles',
      elevationUnit: 'ft',
      notifications: true,
      darkMode: false,
    },
    upcomingRace: races.length > 0 ? races[0] : null,
  });

  // Calculate statistics
  const completionRate = userData.stats.racesCompleted / (userData.stats.racesPlanned || 1);
  
  // Update stats when races change
  useEffect(() => {
    // Only update if races array has content and is different from current data
    if (races && races.length > 0) {
      setUserData(prevData => {
        // Calculate new values
        const racesPlanned = races.length;
        const totalDistance = races.reduce((sum, race) => sum + (race.distance || 0), 0);
        const longestRace = Math.max(...races.map(race => race.distance || 0), 0);
        const upcomingRace = races[0];
        
        // Check if any values have actually changed to prevent unnecessary updates
        if (
          prevData.stats.racesPlanned !== racesPlanned ||
          prevData.stats.totalDistance !== totalDistance ||
          prevData.stats.longestRace !== longestRace ||
          prevData.upcomingRace?.id !== upcomingRace?.id
        ) {
          return {
            ...prevData,
            stats: {
              ...prevData.stats,
              racesPlanned,
              totalDistance,
              longestRace,
            },
            upcomingRace,
          };
        }
        
        // Return the previous state unchanged if nothing has changed
        return prevData;
      });
    }
  }, [races]);

  const renderStatItem = (label, value, unit = '') => (
    <View style={styles.statItem}>
      <Text style={[
        styles.statValue,
        { color: theme.colors.primary }
      ]}>{value}{unit}</Text>
      <Text style={[
        styles.statLabel,
        { color: isDarkMode ? '#9e9e9e' : '#757575' }
      ]}>{label}</Text>
    </View>
  );

  return (
    <ScrollView 
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
      ]}
      contentContainerStyle={{
        paddingTop: insets.top > 0 ? 0 : 16,
        paddingBottom: insets.bottom + 16
      }}
    >
      {/* Profile Header */}
      <View style={[
        styles.profileHeader,
        { 
          backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
          shadowColor: isDarkMode ? '#000000' : '#000000'
        }
      ]}>
        <Avatar.Image 
          size={100} 
          source={userData.profileImage || require('../../assets/default-profile.png')} 
          style={[
            styles.profileImage,
            { backgroundColor: isDarkMode ? '#333333' : '#e0e0e0' }
          ]}
        />
        <View style={styles.profileInfo}>
          <Text style={[
            styles.profileName,
            { color: isDarkMode ? '#ffffff' : '#000000' }
          ]}>{userData.name}</Text>
          <Text style={[
            styles.profileLocation,
            { color: isDarkMode ? '#9e9e9e' : '#757575' }
          ]}>
            <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
            {' '}{userData.location}
          </Text>
          <View style={styles.editButtonContainer}>
            <Button 
              mode="outlined" 
              compact 
              style={[
                styles.editButton,
                { borderColor: theme.colors.primary }
              ]}
              color={theme.colors.primary}
              onPress={() => {/* Navigate to edit profile */}}
            >
              Edit Profile
            </Button>
          </View>
        </View>
      </View>

      {/* Bio Section */}
      <Card style={[
        styles.bioCard,
        { backgroundColor: isDarkMode ? '#1e1e1e' : 'white' }
      ]}>
        <Card.Content>
          <Text style={[
            styles.sectionTitle,
            { color: isDarkMode ? '#ffffff' : '#000000' }
          ]}>About Me</Text>
          <Text style={[
            styles.bioText,
            { color: isDarkMode ? '#e0e0e0' : '#333333' }
          ]}>{userData.bio}</Text>
        </Card.Content>
      </Card>

      {/* Stats Overview */}
      <Card style={[
        styles.statsCard,
        { backgroundColor: isDarkMode ? '#1e1e1e' : 'white' }
      ]}>
        <Card.Content>
          <Text style={[
            styles.sectionTitle,
            { color: isDarkMode ? '#ffffff' : '#000000' }
          ]}>Running Stats</Text>
          <View style={styles.statsGrid}>
            {renderStatItem('Races Planned', userData.stats.racesPlanned)}
            {renderStatItem('Races Completed', userData.stats.racesCompleted)}
            {renderStatItem('Total Distance', userData.stats.totalDistance, ' mi')}
            {renderStatItem('Longest Race', userData.stats.longestRace, ' mi')}
            {renderStatItem('App Usage', userData.stats.appUsage, ' times')}
          </View>
          
          <View style={styles.completionContainer}>
            <View style={styles.completionHeader}>
              <Text style={[
                styles.completionLabel,
                { color: isDarkMode ? '#9e9e9e' : '#757575' }
              ]}>Race Completion Rate</Text>
              <Text style={[
                styles.completionValue,
                { color: theme.colors.primary }
              ]}>{Math.round(completionRate * 100)}%</Text>
            </View>
            <ProgressBar 
              progress={completionRate} 
              color={theme.colors.primary} 
              style={styles.progressBar} 
            />
          </View>
        </Card.Content>
      </Card>

      {/* Upcoming Race */}
      {userData.upcomingRace && (
        <Card style={[
          styles.upcomingCard,
          { backgroundColor: isDarkMode ? '#1e1e1e' : 'white' }
        ]}>
          <Card.Content>
            <Text style={[
              styles.sectionTitle,
              { color: isDarkMode ? '#ffffff' : '#000000' }
            ]}>Next Race</Text>
            <View style={styles.upcomingRaceContainer}>
              <View style={styles.upcomingRaceInfo}>
                <Text style={[
                  styles.upcomingRaceName,
                  { color: isDarkMode ? '#ffffff' : '#000000' }
                ]}>{userData.upcomingRace.name}</Text>
                <Text style={[
                  styles.upcomingRaceDetails,
                  { color: isDarkMode ? '#9e9e9e' : '#757575' }
                ]}>
                  {userData.upcomingRace.distance} miles • {userData.upcomingRace.date}
                </Text>
              </View>
              <Button 
                mode="contained" 
                compact
                color={theme.colors.primary}
                onPress={() => navigation.navigate('RaceDetails', { id: userData.upcomingRace.id })}
              >
                View
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Achievements */}
      <Card style={[
        styles.achievementsCard,
        { backgroundColor: isDarkMode ? '#1e1e1e' : 'white' }
      ]}>
        <Card.Content>
          <Text style={[
            styles.sectionTitle,
            { color: isDarkMode ? '#ffffff' : '#000000' }
          ]}>Achievements</Text>
          {userData.achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementItem}>
              <Avatar.Icon 
                size={40} 
                icon={achievement.icon} 
                style={styles.achievementIcon} 
                color={theme.colors.primary}
                backgroundColor={isDarkMode ? '#333333' : '#e8eaf6'}
              />
              <View style={styles.achievementInfo}>
                <Text style={[
                  styles.achievementName,
                  { color: isDarkMode ? '#ffffff' : '#000000' }
                ]}>{achievement.name}</Text>
                <Text style={[
                  styles.achievementDate,
                  { color: isDarkMode ? '#9e9e9e' : '#757575' }
                ]}>Earned on {achievement.date}</Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Training Summary */}
      <Card style={[
        styles.trainingCard,
        { backgroundColor: isDarkMode ? '#1e1e1e' : 'white' }
      ]}>
        <Card.Content>
          <Text style={[
            styles.sectionTitle,
            { color: isDarkMode ? '#ffffff' : '#000000' }
          ]}>Training Summary</Text>
          <View style={styles.trainingStats}>
            <View style={styles.trainingStatItem}>
              <Text style={[
                styles.trainingStatValue,
                { color: theme.colors.primary }
              ]}>120</Text>
              <Text style={[
                styles.trainingStatLabel,
                { color: isDarkMode ? '#9e9e9e' : '#757575' }
              ]}>Miles This Month</Text>
            </View>
            <View style={styles.trainingStatItem}>
              <Text style={[
                styles.trainingStatValue,
                { color: theme.colors.primary }
              ]}>24</Text>
              <Text style={[
                styles.trainingStatLabel,
                { color: isDarkMode ? '#9e9e9e' : '#757575' }
              ]}>Hours</Text>
            </View>
            <View style={styles.trainingStatItem}>
              <Text style={[
                styles.trainingStatValue,
                { color: theme.colors.primary }
              ]}>15,000</Text>
              <Text style={[
                styles.trainingStatLabel,
                { color: isDarkMode ? '#9e9e9e' : '#757575' }
              ]}>Elevation (ft)</Text>
            </View>
          </View>
          <Button 
            mode="outlined" 
            style={[
              styles.trainingButton,
              { borderColor: theme.colors.primary }
            ]}
            color={theme.colors.primary}
            onPress={() => {/* Navigate to training log */}}
          >
            View Training Log
          </Button>
        </Card.Content>
      </Card>

      {/* Account Settings Link */}
      <Card style={[
        styles.settingsCard,
        { backgroundColor: isDarkMode ? '#1e1e1e' : 'white' }
      ]}>
        <Card.Content>
          <TouchableOpacity 
            style={styles.settingsLink}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color={theme.colors.primary} />
            <Text style={[
              styles.settingsText,
              { color: isDarkMode ? '#ffffff' : '#000000' }
            ]}>Account Settings</Text>
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={isDarkMode ? '#9e9e9e' : '#757575'} 
            />
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  profileHeader: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 8,
    margin: 16,
    marginBottom: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  profileImage: {
    // backgroundColor handled dynamically
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 14,
    marginBottom: 8,
    // color handled dynamically
  },
  editButtonContainer: {
    alignItems: "flex-start",
  },
  editButton: {
    borderRadius: 20,
  },
  bioCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
  },
  statsCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    // color handled dynamically
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
    // color handled dynamically
  },
  completionContainer: {
    marginTop: 8,
  },
  completionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  completionLabel: {
    fontSize: 14,
    // color handled dynamically
  },
  completionValue: {
    fontSize: 14,
    fontWeight: "bold",
    // color handled dynamically
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  upcomingCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  upcomingRaceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  upcomingRaceInfo: {
    flex: 1,
  },
  upcomingRaceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  upcomingRaceDetails: {
    fontSize: 14,
    // color handled dynamically
  },
  achievementsCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  achievementIcon: {
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  achievementDate: {
    fontSize: 12,
    // color handled dynamically
  },
  trainingCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  trainingStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  trainingStatItem: {
    alignItems: "center",
    width: "30%",
  },
  trainingStatValue: {
    fontSize: 20,
    fontWeight: "bold",
    // color handled dynamically
  },
  trainingStatLabel: {
    fontSize: 12,
    textAlign: "center",
    // color handled dynamically
  },
  trainingButton: {
    borderRadius: 20,
  },
  settingsCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  settingsLink: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  settingsText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
});

export default ProfileScreen;