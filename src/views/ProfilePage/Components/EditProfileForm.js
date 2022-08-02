import React, {useState} from "react";
import PropTypes from "prop-types";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button, MenuItem} from "@material-ui/core";
import userAPI from "api/user";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
}));

const toastConfig = {
    fontSize: 30,
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
}

export default function EditProfileTable({ user, updateUser }) {
    const [webSiteURL, setwebSiteURL] = useState(user.WebsiteURL);
    const [linkedInURL, setLinkedInURL] = useState(user.LinkedInURL);
    const [githubURL, setGithubURL] = useState(user.GithubURL);
    const [userIconURL, setUserIconURL] = useState(user.UserIconURL);
    const [bio, setBio] = useState(user.Bio);

    const classes = useStyles();

    const textFieldStyles = () => {
      return {width: "100%", margin: "0 auto", marginBottom: "12px", textAlign: "left"}
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {webSiteURL, linkedInURL, githubURL, userIconURL, bio}
            const res =  await userAPI.update(data);
            updateUser(data);
            toast.success("profile data updated succesfully", toastConfig);
        } catch(err) {
            console.error(err);
            toast.success("could not update profile data", toastConfig);
        }
    }

    return (
        <form style={{textAlign: "center"}} className={classes.root} noValidate onSubmit={handleSubmit}>
             <TextField
                style={{...textFieldStyles()}}
                id="submission-form-bio"
                multiline
                fullWidth
                rows={3}
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                variant="outlined"
            />
            <TextField
                style={textFieldStyles()}
                id="submission-form-webSiteURL"
                label="Website"
                value={webSiteURL}
                onChange={(e) => setwebSiteURL(e.target.value)}
                variant="outlined"
            />
            <TextField
                style={textFieldStyles()}
                id="submission-form-linkedInURL"
                label="LinkedIn"
                value={linkedInURL}
                onChange={(e) => setLinkedInURL(e.target.value)}
                variant="outlined"
            />
            <TextField
                style={textFieldStyles()}
                id="submission-form-githubURL"
                label="Github"
                value={githubURL}
                onChange={(e) => setGithubURL(e.target.value)}
                variant="outlined"
            />
            <TextField
                style={textFieldStyles()}
                id="submission-form-userIconURL"
                label="UserIconURL"
                value={userIconURL}
                onChange={(e) => setUserIconURL(e.target.value)}
                variant="outlined"
            />            
            <Button 
                type="submit"
                variant="contained" 
                color="primary" 
                style={{width: "100%", marginBottom: "12px"}}
            >
                Save
            </Button>
        </form>
    )
}