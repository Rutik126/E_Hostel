import { Link } from "react-router-dom";
import { ICurrentUser } from "../../interfaces/auth";
import { currentUserActions } from "../../store/currentUser";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { defaultAvatarImg } from "../../assets/icons/images";
import { toast } from "react-hot-toast";

function LoggedInHeaderButton({ currentUser, children, role }: Props) {
  const dispatch = useDispatch();
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [route, setRoute] = useState<"staffs" | "chief-wardens" | "students" | "">("");

  useEffect(() => {
    switch (role) {
      case "staff":
        setRoute("staffs");
        break;
      case "chiefWarden":
        setRoute("chief-wardens");
        break;
      case "student":
        setRoute("students");
        break;
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="group">
      <div className="hidden lg:block">
        <Link
          to={route !== "students" ? `/${route}/login` : "/"}
          onClick={() => {
            dispatch(currentUserActions.logout());
            return toast.success("Logged out", {
              style: { background: "rgb(0, 0, 0,0.9)", color: "white" },
            });
          }}
          className="invisible px-4 py-2 bg-white rounded-md border-1 text-primary shadow-lg hover:brightness-90 text-sm font-black group-hover:visible absolute z-10 top-12 right-9"
        >
          Logout
        </Link>
        <Link className=" relative" to={`/${route}/profile`}>
          <div className="flex gap-6">
            <button className="header-btn">
              <img
                className="h-7 mr-1 rounded-sm"
                src={currentUser?.currentUser?.profilePic || defaultAvatarImg}
                alt="Profile"
              />
              <span className="text-xs hidden lg:text-sm lg:block">
                {currentUser?.currentUser?.name.split(" ")[0]}
              </span>
            </button>
          </div>
        </Link>
      </div>
      <div
        className="lg:hidden relative hover:brightness-100"
        onClick={() => setDropdown((prevState) => !prevState)}
      >
        <img
          className="shadow-md h-9 rounded-full"
          src={currentUser?.currentUser?.profilePic || defaultAvatarImg}
          alt="Profile"
        />
        <div
          className={`${
            !dropdown ? "hidden" : ""
          } flex flex-col gap-2 absolute top-8 right-2 shadow-xl border-1 z-10 bg-white p-3 text-sm text-primary font-black rounded-md `}
        >
          {children}
          <Link to={`/${route}/profile`}>Profile</Link>
          <Link
            to={`/${route}/login`}
            onClick={() => {
              toast.success("Logged out", {
                style: { background: "rgb(0, 0, 0,0.9)", color: "white" },
              });
              return dispatch(currentUserActions.logout());
            }}
            className="border-t-2 pt-1 text-red-700"
          >
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}

interface Props {
  children?: any;
  currentUser: ICurrentUser;
  role: "staff" | "chiefWarden" | "student";
}

export default LoggedInHeaderButton;
