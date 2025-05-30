import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import { Save, ArrowLeft } from 'lucide-react';
import { Template, TemplateVariable } from '../../types';
import { templateService } from '../../services/templateService';
import { useNotification } from '../../context/NotificationContext';

const TemplateEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [template, setTemplate] = useState<Template | null>(null);
  const [previewVariables, setPreviewVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      const loadedTemplate = templateService.getPredefinedTemplate(id);
      if (loadedTemplate) {
        setTemplate(loadedTemplate);
        // Initialize preview variables
        const initialVariables: Record<string, string> = {};
        loadedTemplate.variables.forEach(variable => {
          initialVariables[variable.name] = `[${variable.name}]`;
        });
        setPreviewVariables(initialVariables);
      }
    }
  }, [id]);

  const handlePreviewVariableChange = (variableName: string, value: string) => {
    setPreviewVariables(prev => ({
      ...prev,
      [variableName]: value
    }));
  };

  const handleSave = () => {
    addNotification({
      type: 'success',
      message: 'Template saved successfully'
    });
    navigate('/templates');
  };

  if (!template) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Template not found</Typography>
      </Box>
    );
  }

  const previewContent = templateService.populateTemplate(template, previewVariables);

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate('/templates')}
            sx={{ mb: 2 }}
          >
            Back to Templates
          </Button>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {template.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {template.description}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Save size={18} />}
          onClick={handleSave}
        >
          Save Template
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Template Variables
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Customize the variables to preview the template
            </Typography>

            {template.variables.map((variable: TemplateVariable) => (
              <TextField
                key={variable.name}
                fullWidth
                label={variable.name}
                helperText={variable.description}
                value={previewVariables[variable.name] || ''}
                onChange={(e) => handlePreviewVariableChange(variable.name, e.target.value)}
                required={variable.required}
                sx={{ mb: 2 }}
              />
            ))}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Template Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={template.type}
                    label="Type"
                    disabled
                  >
                    <MenuItem value="email">Email Template</MenuItem>
                    <MenuItem value="call-script">Call Script</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {template.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => {}}
                        sx={{
                          backgroundColor: 'primary.light',
                          color: 'white',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Preview
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This is how your template will look with the current variables
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Variables are highlighted in the preview. Update them in the form to see changes.
            </Alert>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {previewContent}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TemplateEditor;