import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AdminProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    avatar: user?.avatar || "",
  });

  if (!isAuthenticated || !user) {
    return <div className="p-8">You must be logged in as admin.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update the user context with new information
    updateUser({ ...user, ...form });
    
    toast({ 
      title: "Success",
      description: "Profile updated successfully!",
      variant: "default"
    });

    // Navigate to dashboard after successful update
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-2">
          <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100">
            {form.avatar ? (
              <img src={form.avatar} alt="avatar" className="object-cover w-full h-full" />
            ) : (
              <span className="text-4xl flex items-center justify-center h-full w-full bg-gray-200">
                {form.name[0]}
              </span>
            )}
          </div>
          <label className="cursor-pointer text-sm">
            Edit Photo
            <Input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <Textarea name="address" value={form.address} onChange={handleChange} />
        </div>
        <Button type="submit" className="w-full">Save Changes</Button>
      </form>
    </div>
  );
};

export default AdminProfilePage;
