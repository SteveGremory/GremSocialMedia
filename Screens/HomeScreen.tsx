import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

//const CancelToken = axios.CancelToken;
//const source = CancelToken.source();
//todo: implement comments number in Line 72
//todo: implement likes number in Line 61

export default class HomeScreen extends React.Component {
   componentDidMount() {
     this.getData;
  }

  getData = async () => {
    const uid = await EncryptedStorage.getItem("userUID");
    await axios
      .post("https://grem-api.herokuapp.com/api/actions/getuser", { uid: uid })
      .then((response) => {
        const respInfo = response.data.message;
        const respPosts = respInfo.posts;
        this.setState({ userPosts: respPosts });
        this.setState({ userInfo: respInfo });
        if (this.setState == false) {
          console.log("Already false.")
        } else 
        {this.setState({ refreshing: false });
      }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onRefresh = () => {
    this.setState({ refreshing: true }, this.getData);
  };

  state = { userPosts: [], userInfo: [], refreshing: false, isLiked: false };
  renderPost = (post) => {
    if(post.image == null) {
    return (
      <View style={styles.feedItem}>
        <View style={{ flexDirection: "column" }}>
          <Image
            source={{ uri: this.state.userInfo.avatar }}
            style={styles.avatar}
          />
          <View style={styles.iconViewNonImage}>
            <TouchableOpacity
              style={styles.iconPropsNonImage}
              onPress={() => {
                this.setState({ isLiked: true });
              }}
            >
              {this.state.isLiked ? (
                <Icon name="heart" size={30} color="red" />
              ) : (
                <Icon name="heart" size={30} color="gray" />
              )}
              <Text style={styles.statPost}></Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconPropsNonImage}
              onPress={() => {
                this.props.navigation.navigate("commentModal", {
                  postUID: post.postUID,
                  postImage: post.image,
                  postText: post.text,
                  postUsername: this.state.userInfo.username,
                  postAvatar: this.state.userInfo.avatar,
                  postTimestamp: post.timestamp,
                });
              }}
            >
              <Icon name="chatbubble-ellipses-outline" size={30} />
              <Text style={styles.statPost}></Text>
            </TouchableOpacity>
          </View>
        </View>

        
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.name}>{this.state.userInfo.username}</Text>
              <Text style={styles.timestamp}>
                {moment(post.timestamp).fromNow()}
              </Text>
            </View>
          </View>

          <Text style={styles.post}>{post.text}</Text>
        </View>
      </View>
    );
      console.log("No image.")
    }
    
    else
    //IF THERE IS AN IMAGE-
    {
    return (
      <View style={styles.feedItem}>
        <View style={{ flexDirection: "column" }}>
          <Image
            source={{ uri: this.state.userInfo.avatar }}
            style={styles.avatar}
          />
          <View style={styles.iconView}>
            <TouchableOpacity
              style={styles.iconProps}
              onPress={() => {
                this.setState({ isLiked: true });
              }}
            >
              {this.state.isLiked ? (
                <Icon name="heart" size={30} color="red" />
              ) : (
                <Icon name="heart" size={30} color="gray" />
              )}
              <Text style={styles.statPost}></Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconProps}
              onPress={() => {
                this.props.navigation.navigate("commentModal", {
                  postUID: post.postUID,
                  postImage: post.image,
                  postText: post.text,
                  postUsername: this.state.userInfo.username,
                  postAvatar: this.state.userInfo.avatar,
                  postTimestamp: post.timestamp,
                });
              }}
            >
              <Icon name="chatbubble-ellipses-outline" size={30} />
              <Text style={styles.statPost}></Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.name}>{this.state.userInfo.username}</Text>
              <Text style={styles.timestamp}>
                {moment(post.timestamp).fromNow()}
              </Text>
            </View>
          </View>

          <Text style={styles.post}>{post.text}</Text>
          
          <Image
            source={{ uri: post.image }}
            style={styles.postImage}
            resizeMode="cover"
          />
        </View>
      </View>
    );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feed</Text>
        </View>
        <FlatList
          style={styles.feed}
          data={this.state.userPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => this.renderPost(item)}
          showsVerticalScrollIndicator={false}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              tintColor="red"
              title="Getting Fresh Posts..."
              titleColor="red"
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  iconView: {
    alignSelf: "flex-start",
    marginTop: "150%",
    marginLeft: "2%",
    marginRight: "2%",
    justifyContent: "space-between",
  },
  iconViewNonImage: {
    alignSelf: "flex-start",
    marginTop: "50%",
    marginLeft: "2%",
    marginRight: "2%",
    justifyContent: "space-between",
  },
  iconProps: {
    marginBottom: 2,
  },
  iconPropsNonImage: {
    marginBottom: 0.5,
  },
  header: {
    ...Platform.select({
      ios: {
        paddingTop: 38,
        shadowColor: "red",
        shadowOffset: { height: 5 },
        shadowRadius: 15,
        shadowOpacity: 0.5,
        zIndex: 16,
      },
      android: {
        paddingTop: 16,
        borderRadius: 20,
      },
    }),
    paddingBottom: 16,
    color: "red",
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "red",

    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "red",
  },
  feed: {
    marginHorizontal: 16,
  },
  feedItem: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 16,
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#454D65",
  },
  timestamp: {
    fontSize: 11,
    color: "#C4C6CE",
    marginTop: 4,
  },
  statPost: {
    fontSize: 11,
    color: "#595959",
    marginTop: 4,
    marginBottom: 4,
    alignSelf: "center",
  },
  post: {
    marginTop: 16,
    fontSize: 14,
    color: "#838899",
  },
  postImage: {
    width: undefined,
    height: 160,
    borderRadius: 10,
    marginVertical: 15,
  },
});
