import { useState } from "react";
import { ArrowLeft, Plus, Edit2, Trash2, RotateCcw, Calendar, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItem {
  id: string;
  content: string;
  description?: string;
  isCompleted: boolean;
  isRepeatable: boolean;
  section: "open" | "completed";
  sortOrder: number;
  createdAt: string;
}

interface ChecklistViewProps {
  checklistId: string;
  checklistTitle: string;
  onBack: () => void;
}

export function ChecklistView({ checklistId, checklistTitle, onBack }: ChecklistViewProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "1",
      content: "Pack clothes for 7 days",
      description: "Include summer and evening wear",
      isCompleted: true,
      isRepeatable: false,
      section: "completed",
      sortOrder: 1,
      createdAt: "2025-01-01T10:00:00Z"
    },
    {
      id: "2",
      content: "Book flights",
      isCompleted: true,
      isRepeatable: false,
      section: "completed",
      sortOrder: 2,
      createdAt: "2025-01-01T10:00:00Z"
    },
    {
      id: "3",
      content: "Check passport validity",
      description: "Ensure passport is valid for 6+ months",
      isCompleted: false,
      isRepeatable: false,
      section: "open",
      sortOrder: 3,
      createdAt: "2025-01-01T10:00:00Z"
    },
    {
      id: "4",
      content: "Water plants",
      description: "Daily watering task",
      isCompleted: false,
      isRepeatable: true,
      section: "open",
      sortOrder: 4,
      createdAt: "2025-01-01T10:00:00Z"
    }
  ]);

  const [newItemContent, setNewItemContent] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemRepeatable, setNewItemRepeatable] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const filteredItems = items.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "open") return !item.isCompleted;
    if (activeTab === "completed") return item.isCompleted;
    return true;
  });

  const openCount = items.filter(item => !item.isCompleted).length;
  const completedCount = items.filter(item => item.isCompleted).length;

  const handleAddItem = () => {
    if (!newItemContent.trim()) return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      content: newItemContent.trim(),
      description: newItemDescription.trim() || undefined,
      isCompleted: false,
      isRepeatable: newItemRepeatable,
      section: "open",
      sortOrder: items.length + 1,
      createdAt: new Date().toISOString()
    };

    setItems([...items, newItem]);
    setNewItemContent("");
    setNewItemDescription("");
    setNewItemRepeatable(false);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Item added",
      description: "New checklist item has been added successfully."
    });
  };

  const handleEditItem = () => {
    if (!editingItem || !editingItem.content.trim()) return;

    setItems(items.map(item => 
      item.id === editingItem.id ? editingItem : item
    ));
    setEditingItem(null);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Item updated",
      description: "Checklist item has been updated successfully."
    });
  };

  const handleToggleItem = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            isCompleted: !item.isCompleted,
            section: !item.isCompleted ? "completed" : "open"
          }
        : item
    ));
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
    toast({
      title: "Item deleted",
      description: "Checklist item has been deleted."
    });
  };

  const handleToggleRepeatable = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, isRepeatable: !item.isRepeatable }
        : item
    ));
    
    toast({
      title: "Repeatable status updated",
      description: "Item repeatability has been toggled."
    });
  };

  const handleCompleteAll = () => {
    setItems(items.map(item => ({
      ...item,
      isCompleted: true,
      section: "completed" as const
    })));
    
    toast({
      title: "All items completed",
      description: "All checklist items have been marked as completed."
    });
  };

  const handleRefreshRepeatables = () => {
    setItems(items.map(item => 
      item.isRepeatable 
        ? { ...item, isCompleted: false, section: "open" as const }
        : item
    ));
    
    toast({
      title: "Repeatable items refreshed",
      description: "All repeatable items have been reset to open status."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{checklistTitle}</h1>
                <p className="text-sm text-muted-foreground">
                  {openCount} open, {completedCount} completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefreshRepeatables}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Refresh Repeatables
              </Button>
              <Button variant="outline" size="sm" onClick={handleCompleteAll}>
                <Check className="h-4 w-4 mr-2" />
                Complete All
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Input
                        id="content"
                        value={newItemContent}
                        onChange={(e) => setNewItemContent(e.target.value)}
                        placeholder="Enter item content..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description (optional)</Label>
                      <Textarea
                        id="description"
                        value={newItemDescription}
                        onChange={(e) => setNewItemDescription(e.target.value)}
                        placeholder="Add a description..."
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="repeatable"
                        checked={newItemRepeatable}
                        onCheckedChange={(checked) => setNewItemRepeatable(checked as boolean)}
                      />
                      <Label htmlFor="repeatable">Make this item repeatable</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddItem}>Add Item</Button>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All ({items.length})</TabsTrigger>
            <TabsTrigger value="open">Open ({openCount})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-3">
              {filteredItems.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No items found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredItems.map(item => (
                  <Card key={item.id} className="transition-all hover:shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={item.isCompleted}
                          onCheckedChange={() => handleToggleItem(item.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`font-medium ${item.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                              {item.content}
                            </p>
                            {item.isRepeatable && (
                              <Badge variant="secondary" className="text-xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                Repeatable
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className={`text-sm text-muted-foreground ${item.isCompleted ? 'line-through' : ''}`}>
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleRepeatable(item.id)}
                            className="h-8 w-8 p-0"
                          >
                            <RotateCcw className={`h-4 w-4 ${item.isRepeatable ? 'text-primary' : 'text-muted-foreground'}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingItem(item);
                              setIsEditDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-content">Content</Label>
                <Input
                  id="edit-content"
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  placeholder="Enter item content..."
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description (optional)</Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.description || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Add a description..."
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-repeatable"
                  checked={editingItem.isRepeatable}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, isRepeatable: checked as boolean })}
                />
                <Label htmlFor="edit-repeatable">Make this item repeatable</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEditItem}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}