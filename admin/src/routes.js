/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Premium from "views/examples/Premium.js";
import Icons from "views/examples/Icons.js";
import Tag from "views/examples/Tag.js";
import Problems from "views/examples/Problems.js";
import Badge from "views/examples/Badge.js";
import Comment from "views/examples/Comment.js";
import Company from "views/examples/Company.js";
import Language from "views/examples/Language.js";
import Ranking from "views/examples/Ranking.js";

import Feedback from "views/examples/Feedback.js";



var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: <Icons />,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
    {
    path: "/Comment",
    name: "Comment",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Comment />,
    layout: "/admin",
  },
      {
    path: "/Ranking",
    name: "Ranking",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Ranking />,
    layout: "/admin",
  },
        {
    path: "/Feedback",
    name: "Feedback",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Feedback />,
    layout: "/admin",
  },
      {
    path: "/Language",
    name: "Language",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Language />,
    layout: "/admin",
  },
  {
    path: "/Premium",
    name: "Premium",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Premium />,
    layout: "/admin",
  },
    {
    path: "/Company",
    name: "Company",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Company />,
    layout: "/admin",
  },
    {
    path: "/Problems",
    name: "Problems",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Problems />,
    layout: "/admin",
  },
    {
    path: "/Tag",
    name: "Tag",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Tag />,
    layout: "/admin",
  },
      {
    path: "/Badge",
    name: "Badge",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Badge />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
];
export default routes;
