'use client'
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography, Paper, Divider, Snackbar, Alert } from "@mui/material";
import { query, collection, getDocs, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const updateInventory = async () => {
    const snapshot = await getDocs(query(collection(firestore, 'inventory')));
    const inventoryList = snapshot.docs.map(doc => ({
      name: doc.id,
      ...doc.data()
    }));
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    await deleteDoc(docRef);
    await updateInventory();
    setSnackbarMessage(`${item} removed from inventory`);
    setSnackbarOpen(true);
  };

  const addItem = async () => {
    const docRef = doc(collection(firestore, 'inventory'), itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + itemQuantity });
      setSnackbarMessage(`${itemName} quantity updated`);
    } else {
      await setDoc(docRef, { quantity: itemQuantity });
      setSnackbarMessage(`${itemName} added to inventory`);
    }
    await updateInventory();
    resetForm();
    setSnackbarOpen(true);
  };

  const updateItem = async () => {
    const docRef = doc(collection(firestore, 'inventory'), currentItem);
    await setDoc(docRef, { quantity: itemQuantity });
    await updateInventory();
    setSnackbarMessage(`${currentItem} quantity updated`);
    resetForm();
    setSnackbarOpen(true);
  };

  const resetForm = () => {
    setItemName('');
    setItemQuantity(1);
    setCurrentItem(null);
    setEditMode(false);
    handleClose();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = (item = null, quantity = 1) => {
    setOpen(true);
    if (item) {
      setEditMode(true);
      setCurrentItem(item);
      setItemName(item);
      setItemQuantity(quantity);
    } else {
      setEditMode(false);
      setItemName('');
      setItemQuantity(1);
    }
  };

  const handleClose = () => setOpen(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box width="100vw" height="100vh" display="flex" justifyContent="center" flexDirection="column" alignItems="center" gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Typography variant="h6">{editMode ? 'Update Item' : 'Add Item'}</Typography>
          <Stack width="100%" direction="row" spacing={2} overflow="auto">
            <TextField
              variant="outlined"
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              variant="outlined"
              type="number"
              label="Quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(Number(e.target.value))}
              inputProps={{ min: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={editMode ? updateItem : addItem}
            >
              {editMode ? 'Update' : 'Add'}
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box width="100%" maxWidth={800} mt={4}>
          <Box p={2}>
            <TextField
              variant="outlined"
              label="Search Items"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
          </Box>
      </Box>

      <Box width="100%" maxWidth={800}>
          <Box p={2}>
            <Button variant="contained" color="primary" onClick={() => handleOpen()}>
              Add New Item
            </Button>
          </Box>
      </Box>

      <Box width="100%" maxWidth={800} mt={4}>
        <Paper elevation={3}>
          <Box p={2}>
            <Typography variant="h5" color="primary">Inventory Items</Typography>
          </Box>
          <Divider />
          <Box p={2}>
            <Stack spacing={2}>
              {filteredInventory.map(({ name, quantity }) => (
                <Paper key={name} elevation={2}>
                  <Box p={2} display="flex" alignItems="center" justifyContent="space-between" >
                    <Typography>{name} (Quantity: {quantity})</Typography>
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" color="primary" onClick={() => handleOpen(name, quantity)}>Edit</Button>
                      <Button variant="contained" color="error" onClick={() => removeItem(name)}>Remove</Button>
                    </Stack>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Paper>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}