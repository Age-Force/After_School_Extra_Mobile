<template>
    <Page>
        <ActionBar title="AgeForce Program" />
        <FlexboxLayout class="page">
            <TabView height="100%" androidTabsPosition="button"
                backgroundColor="#FFF">
                <!--Search For Lessons-->
                <TabViewItem title="Lesson">
                    <StackLayout orientation="vertical">
                        <Button class="btn btn-primary m-t-20"
                            text="Sort Price" @tap="onButtonTap"
                            style="align:center;width:30%" />

                        <TextField v-model="searchPhrase"
                            hint="Enter search term here ..." />
                        <ListView class="list-group"
                            for="item in filteredClasses" @itemTap="onItemTap"
                            style="height:75%">
                            <v-template>
                                <Label :text="item.topic"
                                    class="list-group-item-heading"
                                    textWrap="true" />
                                <Label textWrap="true" class="label">
                                    <FormattedString>
                                        <Span :text="item.topic" />
                                        <Span text=" - " />
                                        <Span :text="item.location" />
                                        <Span text=" - " />
                                        <Span :text="item.price" />
                                    </FormattedString>
                                </Label>
                            </v-template>
                        </ListView>
                    </StackLayout>
                </TabViewItem>
            </TabView>
        </FlexboxLayout>
    </Page>
</template>

<script>
import RadDataForm from "nativescript-ui-dataform/vue";
Vue.use(RadDataForm);

import Vue from "nativescript-vue";
import RadSideDrawer from "nativescript-ui-sidedrawer/vue";
Vue.use(RadSideDrawer);

import Search from "./Search";
var ngorkstring = "https://5850e4de.ngrok.io";

export default {
    methods: {
        onButtonTap() {
            console.log("Sorting by Price");

            var byPrice = this.classes.slice(0);
            var sortdone = this.issort;
            byPrice.sort(function(a, b) {
                if (sortdone === false) {
                    return a.price - b.price;
                } else if (sortdone === true) {
                    return b.price - a.price;
                }
            });

            console.log(sortdone);

            if (sortdone === true) this.issort = false;
            if (sortdone === false) this.issort = true;
            this.classes = byPrice.slice(0);
        },

        onOpenDrawerTap() {
            this.$refs.drawer.nativeView.showDrawer();
        },
        onCloseDrawerTap() {
            this.$refs.drawer.nativeView.closeDrawer();
        },

        onSearchSubmit(args) {
            let searchBar = args.object;
        },

        onItemTap: function(args) {
            console.log("Item with index: " + args.index + " tapped");
        },

        validEmail: function(emai) {
            var re =
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
            return re.test(emai);
        },

        //form validation
        checkForm: function(e) {
            if (this.name && this.email) {
                return true;
            }
            this.errors = [];

            if (!this.name) {
                this.errors.push("Name required.");
            }

            if (!this.password) {
                this.errors.push("Password required.");
            }

            if (!this.email) {
                this.errors.push("Please Enter Email.");
            }

            if (!this.validEmail(this.email)) {
                this.errors.push("Please Enter Correct Email Format");
            }

            console.log(this.errors[0]);
            console.log(this.errors.length);
            this.$navigateTo(Search);
        },

        //this is to register a new user into the mongoDB
        register() {
            console.log("Name: " + this.name);
            console.log("Password : " + this.password);
            console.log("Email:" + this.email);

            var details = {
                email: this.email,
                password: this.password,
                name: this.name,
                usertype: this.usertype
            };

            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            this.checkForm();
            if (this.errors[0] == null) {
                fetch(ngorkstring + "/form_decision", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                    },
                    body: formBody
                });
                console.log("submitting to database ");
            } else console.log("theres an error");

            this.$navigateTo(Search);
            console.log(formBody);
        },

        //fetching users form the database.
        login() {
            console.log("Attempting Log in");
            var details = {
                email: this.email,
                password: this.password,
                name: this.name,
                usertype: this.usertype
            };
            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            if (this.errors[0] == null) {
                fetch(ngorkstring + "/logindecision", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                    },
                    body: formBody
                }).then(response => {
                    response.json().then(data => {
                        console.log(data);
                        if (data != 0) {
                            if (data[0]["password"] ==
                                this.password)
                                this.status = "Welcome " +
                                data[0]["name"];
                            else this.status =
                                "Wrong password: Try again";
                        } else this.status =
                            "Wrong email: User Not Found";
                    });
                });
            } else console.log("theres an error");
            console.log(formBody);
        }
    },

    //this is the search function.
    created: function(allcoursess) {
        console.log("App Started ");
        fetch(ngorkstring + "/allcourses").then(response => {
            return response.json().then(classes => {
                this.classes = classes;
            });
        });
        console.log("Classes " + this.classes);
        console.log(this.searchPhrase);
    },
    data() {
        return {
            album: {
                bandName: "Ed Sheeran",
                albumName: "X",
                year: "2017",
                owned: true,
                myRating: "9.5"
            },

            mainContentText: "SideDrawer for NativeScript can be easily setup in the XML definition of your page by defining main- and drawer-content. The component" +
                " has a default transition and position and also exposes notifications related to changes in its state. Swipe from left to open side drawer.",

            status: "",
            issort: false,
            searchPhrase: "",
            name: "",
            password: "",
            classes: [],
            email: "",
            usertype: "",
            textFieldValue: "",
            errors: []
        };
    },
    computed: {
        filteredClasses: function() {
            return this.classes.filter(classes => {
                return (
                    classes.topic
                    .toLowerCase()
                    .indexOf(this.searchPhrase
                        .toLowerCase()) > -1
                );
            });
        }
    }
};
</script>

<style scoped>
    TextField {
        color: #000000;
        background-color: Gray;
    }

    .page {
        align-items: center;
        flex-direction: column;
        color: #000;
    }

    .home-panel {
        vertical-align: center;
        font-size: 20;
        margin: 15;

    }

    .form {
        margin-left: 30;
        margin-right: 30;
        flex-grow: 2;
        vertical-align: middle;
        color: #000000;
    }

    .description-label {
        margin-bottom: 15;
    }

    .logo {
        margin-bottom: 12;
        height: 200;
        font-weight: bold;
    }

    .header {
        horizontal-align: center;
        font-size: 25;
        font-weight: 600;
        margin-bottom: 70;
        text-align: center;
        color: #4c4c47;
    }

    .btn-primary {
        height: 50;
        width: 200;
        margin: 30 5 15 5;
        background-color: #FFA500;
        border-radius: 5;
        font-size: 20;
        font-weight: 600;
    }

    .label {
        width: 50;
        height: 100;
    }
</style>