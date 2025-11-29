import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  FieldGroup,
  FieldSet,
  Field,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select';
import { useState } from 'react';
import { derivationStatusConfig } from '@/constants/derivations';
import { DerivationStatus } from '@repo/types';
import { Badge } from '@/components/ui/badge';

export default function CorrectionComment() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const statuses = Object.entries(derivationStatusConfig).map(
    ([key, value]) => ({
      value: key,
      label: value.text,
    })
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Correction</CardTitle>
        <CardDescription>
          Veuillez corriger les informations du formulaire d'intervention,
          mettre a jour le statut du formulaire d'intervention et d'enregistrer
          les modifications afin de valider la correction au technicien.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-optional-comments">
                    Commentaire de correction
                  </FieldLabel>
                  <Textarea
                    id="checkout-7j9-optional-comments"
                    placeholder="Ajouter n'importe quel commentaire de correction..."
                    className="resize-none"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
            <Field>
              <FieldLabel>Mettre à jour le statut</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                Selectionner un des trois status après votre revue :{' '}
                <Badge variant="default" className="bg-green-500">
                  {derivationStatusConfig[DerivationStatus.COMPLETED].text}
                </Badge>
                {' - '}
                <Badge variant="secondary">
                  {derivationStatusConfig[DerivationStatus.REVISING].text}
                </Badge>
                {' - '}
                <Badge variant="destructive">
                  {derivationStatusConfig[DerivationStatus.INCORRECT].text}
                </Badge>
              </FieldDescription>
            </Field>
            <Field orientation="horizontal" className="w-full justify-end">
              <Button type="submit" className="w-full">
                Enregistrer
              </Button>
              <Button variant="outline" type="button" className="w-full">
                Annuler
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
