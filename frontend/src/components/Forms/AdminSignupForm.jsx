import { useEffect } from "react";

const AdminSignupForm = () => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.keyCode === 123 || // F12
        event.keyCode === 44 || // PrintScreen
        (event.ctrlKey && (event.keyCode === 80 || event.keyCode === 83)) || // Ctrl+P, Ctrl+S
        (event.metaKey && event.shiftKey && event.keyCode === 83) || // Windows+Shift+S (Snipping Tool)
        (event.ctrlKey && event.shiftKey && (event.keyCode === 73 || event.keyCode === 74)) || // Ctrl+Shift+I, Ctrl+Shift+J
        (event.ctrlKey && event.keyCode === 85) // Ctrl+U (View Source)
      ) {
        event.preventDefault();
        console.log("Blocked Key: " + event.key);
        alert("This action is disabled!");
      }
    };

    const handleContextMenu = (event) => {
      event.preventDefault();
   
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h1 className="text-xl font-semibold">Right Click is Disabled on This Page</h1>
    </div>
  );
};


export default AdminSignupForm;
